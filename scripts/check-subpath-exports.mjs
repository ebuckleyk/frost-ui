// Verifies every `@ebuckleyk/frost-ui/components/*` subpath exports at runtime exactly the values its
// declarations promise. Run after `npm run build`.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const typesRoot = resolve(root, 'dist/types/components');

// Some components touch DOM globals at module evaluation (custom elements, matchMedia, etc.).
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (!(key in globalThis)) {
    try {
      globalThis[key] = dom.window[key];
    } catch {
      // Some window properties are read-only accessors; skip them.
    }
  }
}

const components = readdirSync(typesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => existsSync(resolve(typesRoot, name, 'index.d.ts')));
assert.ok(components.length > 0, 'No component declarations found; run `npm run build` first.');

const declarationFiles = components.map((name) => resolve(typesRoot, name, 'index.d.ts'));
const program = ts.createProgram(declarationFiles, {
  noEmit: true,
  skipLibCheck: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ES2022,
});
const checker = program.getTypeChecker();

function declaredValueExports(file) {
  const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(file));
  assert.ok(moduleSymbol, `Could not read declarations for ${file}`);
  return checker
    .getExportsOfModule(moduleSymbol)
    .filter((symbol) => {
      const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
      // const enums are inlined by the compiler and never exist at runtime.
      return Boolean(target.flags & ts.SymbolFlags.Value) && !(target.flags & ts.SymbolFlags.ConstEnum);
    })
    .map((symbol) => symbol.getName())
    .sort();
}

const specifiers = components.map((name) => `${manifest.name}/components/${name}`);
const imported = await Promise.allSettled(specifiers.map((specifier) => import(specifier)));

const failures = [];
for (const [index, specifier] of specifiers.entries()) {
  const declared = declaredValueExports(declarationFiles[index]);
  const result = imported[index];
  if (result.status === 'rejected') {
    failures.push(`${specifier}: failed to import (${result.reason?.message ?? result.reason})`);
    continue;
  }
  const runtime = Object.keys(result.value).sort();
  const missing = declared.filter((key) => !runtime.includes(key));
  const undeclared = runtime.filter((key) => !declared.includes(key));
  if (missing.length) failures.push(`${specifier}: declared but missing at runtime: ${missing.join(', ')}`);
  if (undeclared.length) failures.push(`${specifier}: exported at runtime but undeclared: ${undeclared.join(', ')}`);
}

assert.equal(failures.length, 0, `Subpath export drift:\n  ${failures.join('\n  ')}`);
console.log(`Subpath export checks passed for ${components.length} component entries.`);
process.exit(0);
