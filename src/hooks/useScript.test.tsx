import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useScript, type UseScriptOptions } from './useScript';

let counter = 0;
const uniqueSrc = (name: string) => `/${name}-${++counter}.js`;

function getNode(src: string) {
  return Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]')).find(
    (node) => node.getAttribute('src') === src,
  );
}

function fire(src: string, type: 'load' | 'error') {
  const node = getNode(src);
  if (!node) throw new Error(`No script node for ${src}`);
  act(() => {
    node.dispatchEvent(new Event(type));
  });
}

type Props = { src: string | null; options?: UseScriptOptions };

function renderUseScript(initialProps: Props) {
  return renderHook(({ src, options }: Props) => useScript(src, options), { initialProps });
}

afterEach(() => {
  document.querySelectorAll('script[src]').forEach((node) => node.remove());
});

describe('useScript', () => {
  it('inserts a script that starts loading and becomes ready on load', () => {
    const src = uniqueSrc('basic');
    const { result } = renderUseScript({ src });

    expect(result.current).toBe('loading');
    expect(getNode(src)?.getAttribute('data-status')).toBe('loading');

    fire(src, 'load');
    expect(result.current).toBe('ready');
    expect(getNode(src)?.getAttribute('data-status')).toBe('ready');
  });

  it('reports loading for a new source until that source loads (ready A -> B)', () => {
    const a = uniqueSrc('a');
    const b = uniqueSrc('b');
    const statuses: string[] = [];
    const { result, rerender } = renderHook(
      ({ src }: { src: string }) => {
        const status = useScript(src, { removeOnUnmount: true });
        statuses.push(`${src}:${status}`);
        return status;
      },
      { initialProps: { src: a } },
    );

    fire(a, 'load');
    expect(result.current).toBe('ready');

    statuses.length = 0;
    rerender({ src: b });
    expect(result.current).toBe('loading');
    expect(statuses).not.toContain(`${b}:ready`);
    expect(getNode(b)?.getAttribute('data-status')).toBe('loading');
    expect(getNode(a)).toBeUndefined();

    fire(b, 'load');
    expect(result.current).toBe('ready');
  });

  it('does not carry an error from A over to B (error A -> B)', () => {
    const a = uniqueSrc('err-a');
    const b = uniqueSrc('err-b');
    const { result, rerender } = renderUseScript({ src: a });

    fire(a, 'error');
    expect(result.current).toBe('error');
    expect(getNode(a)?.getAttribute('data-status')).toBe('error');

    rerender({ src: b });
    expect(result.current).toBe('loading');

    fire(b, 'load');
    expect(result.current).toBe('ready');
  });

  it('resets to idle when src becomes null and loads again when it returns', () => {
    const src = uniqueSrc('null-toggle');
    const { result, rerender } = renderUseScript({ src, options: { removeOnUnmount: true } });

    fire(src, 'load');
    expect(result.current).toBe('ready');

    rerender({ src: null, options: { removeOnUnmount: true } });
    expect(result.current).toBe('idle');
    expect(getNode(src)).toBeUndefined();

    rerender({ src, options: { removeOnUnmount: true } });
    expect(result.current).toBe('loading');
    expect(getNode(src)).toBeDefined();

    fire(src, 'load');
    expect(result.current).toBe('ready');
  });

  it('resets to idle when shouldPreventLoad toggles on, and back when it toggles off', () => {
    const src = uniqueSrc('prevent-toggle');
    const { result, rerender } = renderUseScript({ src, options: { shouldPreventLoad: true } });

    expect(result.current).toBe('idle');
    expect(getNode(src)).toBeUndefined();

    rerender({ src, options: { shouldPreventLoad: false } });
    expect(result.current).toBe('loading');
    fire(src, 'load');
    expect(result.current).toBe('ready');

    rerender({ src, options: { shouldPreventLoad: true } });
    expect(result.current).toBe('idle');

    // Without removeOnUnmount the loaded script persists, so its status is reused.
    rerender({ src, options: { shouldPreventLoad: false } });
    expect(result.current).toBe('ready');
  });

  it('reinserts and reloads a script after removeOnUnmount removed it', () => {
    const src = uniqueSrc('remount');
    const first = renderUseScript({ src, options: { removeOnUnmount: true } });
    fire(src, 'load');
    expect(first.result.current).toBe('ready');

    first.unmount();
    expect(getNode(src)).toBeUndefined();

    const second = renderUseScript({ src, options: { removeOnUnmount: true } });
    expect(second.result.current).toBe('loading');
    expect(getNode(src)?.getAttribute('data-status')).toBe('loading');

    fire(src, 'load');
    expect(second.result.current).toBe('ready');
  });

  it('retries a script after an errored node was removed', () => {
    const src = uniqueSrc('error-remount');
    const first = renderUseScript({ src, options: { removeOnUnmount: true } });
    fire(src, 'error');
    expect(first.result.current).toBe('error');
    first.unmount();
    expect(getNode(src)).toBeUndefined();

    const second = renderUseScript({ src });
    expect(second.result.current).toBe('loading');
    fire(src, 'load');
    expect(second.result.current).toBe('ready');
  });

  it('does not reuse a cached status when the node was removed externally', () => {
    const src = uniqueSrc('external-remove');
    const first = renderUseScript({ src });
    fire(src, 'load');
    first.unmount();

    getNode(src)?.remove();

    const second = renderUseScript({ src });
    expect(second.result.current).toBe('loading');
    expect(getNode(src)).toBeDefined();
  });

  it('shares one node between two subscribers and keeps it until both unmount', () => {
    const src = uniqueSrc('shared');
    const one = renderUseScript({ src, options: { removeOnUnmount: true } });
    const two = renderUseScript({ src, options: { removeOnUnmount: true } });

    expect(document.querySelectorAll(`script[src="${src}"]`)).toHaveLength(1);
    expect(one.result.current).toBe('loading');
    expect(two.result.current).toBe('loading');

    fire(src, 'load');
    expect(one.result.current).toBe('ready');
    expect(two.result.current).toBe('ready');

    one.unmount();
    expect(getNode(src)).toBeDefined();
    expect(two.result.current).toBe('ready');

    two.unmount();
    expect(getNode(src)).toBeUndefined();
  });

  it('gives a late subscriber the shared status immediately', () => {
    const src = uniqueSrc('late');
    const one = renderUseScript({ src });
    fire(src, 'load');

    const two = renderUseScript({ src });
    expect(two.result.current).toBe('ready');
    expect(document.querySelectorAll(`script[src="${src}"]`)).toHaveLength(1);
    one.unmount();
    two.unmount();
  });

  it('uses the data-status of a script added outside the hook', () => {
    const src = uniqueSrc('external');
    const node = document.createElement('script');
    node.src = src;
    node.setAttribute('data-status', 'ready');
    document.body.appendChild(node);

    const { result } = renderUseScript({ src });
    expect(result.current).toBe('ready');
    expect(document.querySelectorAll(`script[src="${src}"]`)).toHaveLength(1);
  });
});
