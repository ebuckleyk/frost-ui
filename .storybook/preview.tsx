import * as React from 'react';
import type { Preview } from '@storybook/react';

import { Toaster } from '../src/components/Toast';
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
  decorators: [
    (Story, context) => {
      return (
        <React.Fragment>
          <Story />
          <Toaster />
        </React.Fragment>
      );
    },
  ],
};

export default preview;