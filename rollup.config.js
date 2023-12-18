import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';
import copy from 'rollup-plugin-copy';
import { dts } from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';

import packageJson from './package.json';
import tailwindConfig from './tailwind.config.js';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  external: ['react-dom'],
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
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
      config: {
        path: './postcss.config.js',
      },
      extensions: ['.css'],
      minimize: true,
      inject: {
        insertAt: 'top',
      },
      plugins: [tailwindcss(tailwindConfig)],
    }),
    copy({
      targets: [{ src: './tailwind.config.js', dest: 'dist/configs/tailwindcss/' }],
    }),
    terser(),
    bundleSize(),
  ],
};

/**
 * @type {import('rollup').RollupOptions}
 */
const typesConfig = {
  input: 'dist/esm/types/index.d.ts',
  output: [{ file: 'dist/index.d.ts', format: 'esm' }],
  plugins: [dts()],
  // https://stackoverflow.com/questions/71848226/creating-react-library-with-rollup-js-i-get-error-null-reading-usestate/7260405
  external: [/\.(css|less|scss)$/, 'react', 'react-dom'],
};
export default [config, typesConfig];
