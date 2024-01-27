import * as React from 'react';
import type { Preview } from '@storybook/react';

import { SonnerToaster } from '../src/components/Sonner';
import { ThemeProvider } from '../src/components/ThemeProvider';
import { Toaster } from '../src/components/Toast';
import viewports from './viewports';
// https://github.com/tailwindlabs/tailwindcss/issues/6314#issuecomment-991093531
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        //color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      panelPosition: 'bottom',
      storySort: {
        method: 'alphabetical',
        order: [],
      },
    },
    viewport: {
      viewports: viewports,
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'light',
          value: '#F8F8F8',
        },
        {
          name: 'dark',
          value: '#333333',
        },
        {
          name: 'image',
          value:
            'url("https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")',
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Component Theme',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.parameters.theme || context.globals.theme;
      return (
        <React.Fragment>
          <ThemeProvider theme={theme}>
            {/* <div style={{ margin: 'auto', width: '50%', padding: 10 }}> */}
            <Story />
            <Toaster />
            <SonnerToaster />
            {/* </div> */}
          </ThemeProvider>
        </React.Fragment>
      );
    },
  ],
};

export default preview;
