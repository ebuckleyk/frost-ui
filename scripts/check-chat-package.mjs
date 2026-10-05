import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { AssistantRuntimeProvider, useExternalStoreRuntime } from '@assistant-ui/react';
import {
  Chat,
  ChatComposer,
  ChatComposerInput,
  ChatComposerSend,
  ChatMessages,
  ChatViewport,
} from '@ebuckleyk/frost-ui/components/Chat';
import { renderToString } from 'react-dom/server';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const manifest = JSON.parse(read('package.json'));
assert.equal(manifest.peerDependenciesMeta['@assistant-ui/react'].optional, true);
assert.equal(manifest.devDependencies['@assistant-ui/react'], '0.15.23');
assert.equal(manifest.peerDependencies['@assistant-ui/react'], '>=0.15.23 <0.16.0');
assert.ok(read('dist/components/Chat/Chat.mjs').startsWith("'use client';"));
assert.match(read('dist/components/Chat/Chat.mjs'), /from\s*["']@assistant-ui\/react["']/);
assert.ok(read('dist/types/components/Chat/index.d.ts').includes('./Chat'));
assert.ok(!read('dist/index.d.ts').includes('@assistant-ui'));
assert.ok(read('dist/styles/frostui.css').includes('wrap-anywhere'));
assert.ok(read('dist/styles/tailwind.css').includes("@source '../components'"));

// Inspect the ordinary entry's complete static import graph, not just its barrel text.
const visited = new Set();
function visit(path) {
  if (visited.has(path)) return;
  visited.add(path);
  const source = readFileSync(path, 'utf8');
  for (const match of source.matchAll(/(?:from|import)\s*["']([^"']+)["']/g)) {
    const dependency = match[1];
    assert.ok(!dependency.includes('@assistant-ui'), `${path} imports assistant-ui`);
    assert.ok(!dependency.includes('/Chat/'), `${path} imports Chat`);
    if (dependency.startsWith('.') && dependency.endsWith('.mjs')) visit(resolve(dirname(path), dependency));
  }
}
visit(resolve(root, 'dist/index.mjs'));
function inspectFiles(path) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    assert.ok(!entry.name.includes('assistant-ui'), 'A private assistant-ui copy was bundled');
    if (entry.isDirectory()) inspectFiles(resolve(path, entry.name));
  }
}
inspectFiles(resolve(root, 'dist'));

// A consumer-owned provider must work with the emitted package components.
const h = React.createElement;
function Consumer() {
  const runtime = useExternalStoreRuntime({
    messages: [{ id: 'consumer-message', role: 'assistant', content: 'Shared runtime works.' }],
    convertMessage: (message) => message,
    onNew: async () => {},
  });
  return h(
    AssistantRuntimeProvider,
    { runtime },
    h(
      Chat,
      null,
      h(ChatViewport, { 'aria-label': 'Conversation' }, h(ChatMessages)),
      h(ChatComposer, null, h(ChatComposerInput, { label: 'Message assistant' }), h(ChatComposerSend)),
    ),
  );
}
const html = renderToString(h(Consumer));
assert.ok(html.includes('Shared runtime works.'));
assert.ok(html.includes('Message assistant'));
console.log(`Chat package checks passed; ordinary entry traversed ${visited.size} modules without assistant-ui.`);
