import type { StorybookConfig } from '@storybook/react-vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

//not needed: https://github.com/storybookjs/builder-vite/issues/82#issuecomment-894314650

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    '@storybook/addon-a11y',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return {
      ...config,
      plugins: [...(config.plugins || []), ...[viteTsconfigPaths()]],
    };
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};
export default config;
