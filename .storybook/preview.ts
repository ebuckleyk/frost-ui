import type { Preview } from '@storybook/react';

import { withThemeByClassName } from '@storybook/addon-themes';
// https://github.com/tailwindlabs/tailwindcss/issues/6314#issuecomment-991093531
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        //color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
