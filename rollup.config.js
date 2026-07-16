import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import { dts } from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import sizes from 'rollup-plugin-sizes';
import { visualizer } from 'rollup-plugin-visualizer';
import ts from 'typescript';

import packageJson from './package.json';

const peerDependencies = Object.keys(packageJson.peerDependencies || {});
const isPeerDependency = (id) =>
  peerDependencies.some((dependency) => id === dependency || id.startsWith(`${dependency}/`));

// Keep Rollup from receiving raw TypeScript when the declaration emitter cannot resolve a source path.
const transpileTypeScript = () => ({
  name: 'transpile-typescript',
  transform(code, id) {
    if (!/\.[cm]?tsx?$/.test(id)) {
      return null;
    }

    return {
      code: ts.transpileModule(code, {
        compilerOptions: {
          jsx: ts.JsxEmit.React,
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2016,
        },
        fileName: id,
      }).outputText,
      map: null,
    };
  },
});

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: ['src/index.ts', 'src/styles/index.ts', 'src/styles/theme-preset.js'],
  external: isPeerDependency,
  output: [
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: (chunkInfo) => {
        if (chunkInfo.name.includes('node_modules')) {
          return chunkInfo.name.replace('node_modules', 'external') + '.mjs';
        }
        return '[name].mjs';
      },
    },
  ],
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    peerDepsExternal(),
    resolve(),
    typescript({ tsconfig: './tsconfig.json', exclude: ['**/*.test.ts', '**/*.stories.ts'] }),
    transpileTypeScript(),
    commonjs(),
    postcss({
      extensions: ['.css'],
      minimize: true,
      extract: 'styles/frostui.css',
      plugins: [
        require('@tailwindcss/postcss')({
          config: './tailwind.config.js',
        }),
      ],
    }),
    copy({
      targets: [
        {
          src: 'src/styles/frostui.css',
          dest: 'dist/styles',
          rename: 'tailwind.css',
        },
        {
          src: 'src/styles/utilities.css',
          dest: 'dist/styles',
        },
      ],
      hook: 'writeBundle',
    }),
    terser(),
    sizes(),
    visualizer(),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes(`"use client"`)) return;
    warn(warning);
  },
};

/**
 * @type {import('rollup').RollupOptions}
 */
const typesConfig = {
  input: 'dist/types/index.d.ts',
  output: [{ file: 'dist/index.d.ts', format: 'esm' }],
  plugins: [dts()],
  // https://stackoverflow.com/questions/71848226/creating-react-library-with-rollup-js-i-get-error-null-reading-usestate/7260405
  external: (id) => /\.(css|less|scss)$/.test(id) || isPeerDependency(id),
};
export default [config, typesConfig];
