import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import { dts } from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
//import bundleSize from 'rollup-plugin-bundle-size';
import sizes from 'rollup-plugin-sizes';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from 'tailwindcss';

import packageJson from './package.json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tailwindConfig = require('./tailwind.config.js');

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  external: ['react', 'react-dom'],
  output: [
    // {
    //   // file: packageJson.main,
    //   dir: 'dist/cjs',
    //   format: 'cjs',
    //   sourcemap: true,
    //   preserveModules: true,
    // },
    {
      // file: packageJson.module,
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
      targets: [{ src: './src/styles/theme-preset.js', dest: 'dist/presets/', rename: 'theme.js' }],
    }),
    terser(),
    //bundleSize(),
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
