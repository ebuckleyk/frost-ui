import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import sizes from 'rollup-plugin-sizes';
import { visualizer } from 'rollup-plugin-visualizer';

import packageJson from './package.json';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  external: ['react', 'react-dom'],
  output: [
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: (chunkInfo) => {
        if (chunkInfo.name.includes('node_modules')) {
          return chunkInfo.name.replace('node_modules', 'external') + '.js';
        }
        return '[name].js';
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
    commonjs(),
    typescript({ tsconfig: './tsconfig.json', exclude: ['**/*.test.ts', '**/*.stories.ts'] }),
    postcss({
      extensions: ['.css'],
      minimize: true,
      extract: 'styles/frostui.css',
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
  external: [/\.(css|less|scss)$/, ...(Object.keys(packageJson.peerDependencies) || {})],
};
export default [config, typesConfig];
