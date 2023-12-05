import type { Preview } from '@storybook/react';
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
    options: {
      panelPosition: 'right',
      storySort: {
        method: 'alphabetical',
        order: [],
      },
    },
  },
};

export default preview;
