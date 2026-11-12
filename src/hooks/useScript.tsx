// Based on https://usehooks-ts.com/react-hook/use-script
import { useEffect, useState } from 'react';

export type UseScriptStatus = 'idle' | 'loading' | 'ready' | 'error';
export interface UseScriptOptions {
  shouldPreventLoad?: boolean;
  removeOnUnmount?: boolean;
}

/**
 * One entry per script node this hook knows about. The entry lives exactly as
 * long as its node: when the node is removed (by this hook or by anything else)
 * the entry is discarded, so a cached `ready`/`error` is never reused for a
 * node that no longer exists.
 *
 * Persistent-execution contract: when no subscriber asks for removal, the node
 * stays in the document after the last subscriber unmounts, and a later mount
 * reuses its status (a loaded script has already executed and is not reloaded).
 */
interface ScriptEntry {
  node: HTMLScriptElement;
  status: UseScriptStatus;
  subscribers: number;
  listeners: Set<() => void>;
}

const scripts = new Map<string, ScriptEntry>();

function findScriptNode(src: string): HTMLScriptElement | null {
  // Compare the attribute directly so `src` never needs CSS escaping.
  const nodes = document.querySelectorAll<HTMLScriptElement>('script[src]');
  for (const node of Array.from(nodes)) {
    if (node.getAttribute('src') === src) {
      return node;
    }
  }
  return null;
}

function getLiveEntry(src: string): ScriptEntry | undefined {
  const entry = scripts.get(src);
  if (entry && !entry.node.isConnected) {
    // The node was removed outside this hook; its status no longer applies.
    scripts.delete(src);
    return undefined;
  }
  return entry;
}

function acquireEntry(src: string): ScriptEntry {
  const existing = getLiveEntry(src);
  if (existing) {
    existing.subscribers += 1;
    return existing;
  }

  let node = findScriptNode(src);
  let status: UseScriptStatus;

  if (node) {
    // Added outside this hook (or server-rendered): trust its attribute when present.
    status = (node.getAttribute('data-status') as UseScriptStatus | null) ?? 'loading';
  } else {
    node = document.createElement('script');
    node.src = src;
    node.async = true;
    status = 'loading';
    document.body.appendChild(node);
  }
  node.setAttribute('data-status', status);

  const entry: ScriptEntry = { node, status, subscribers: 1, listeners: new Set() };

  const handleEvent = (event: Event) => {
    entry.status = event.type === 'load' ? 'ready' : 'error';
    entry.node.setAttribute('data-status', entry.status);
    entry.listeners.forEach((listener) => listener());
  };
  node.addEventListener('load', handleEvent);
  node.addEventListener('error', handleEvent);

  scripts.set(src, entry);
  return entry;
}

function releaseEntry(src: string, entry: ScriptEntry, remove: boolean) {
  entry.subscribers -= 1;
  if (!remove || entry.subscribers > 0) {
    return;
  }

  entry.node.remove();
  if (scripts.get(src) === entry) {
    scripts.delete(src);
  }
}

function resolveStatus(src: string | null): UseScriptStatus {
  if (!src) {
    return 'idle';
  }
  if (typeof window === 'undefined') {
    // SSR handling - always report 'loading'
    return 'loading';
  }
  return getLiveEntry(src)?.status ?? 'loading';
}

export function useScript(src: string | null, options?: UseScriptOptions): UseScriptStatus {
  const shouldPreventLoad = options?.shouldPreventLoad ?? false;
  const removeOnUnmount = options?.removeOnUnmount ?? false;
  const requestedSrc = src && !shouldPreventLoad ? src : null;

  const [state, setState] = useState<{ src: string | null; status: UseScriptStatus }>(() => ({
    src: requestedSrc,
    status: resolveStatus(requestedSrc),
  }));

  useEffect(() => {
    if (!requestedSrc) {
      return;
    }

    const entry = acquireEntry(requestedSrc);
    const sync = () => setState({ src: requestedSrc, status: entry.status });
    entry.listeners.add(sync);
    sync();

    return () => {
      entry.listeners.delete(sync);
      releaseEntry(requestedSrc, entry, removeOnUnmount);
    };
  }, [requestedSrc, removeOnUnmount]);

  // Never report a status that belongs to a previously requested source.
  return state.src === requestedSrc ? state.status : resolveStatus(requestedSrc);
}
