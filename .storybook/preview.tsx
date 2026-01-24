import * as React from 'react';
import type { Preview } from '@storybook/react';

import { SonnerToaster } from '../src/components/Sonner';
import { ThemeProvider } from '../src/components/ThemeProvider';
import viewports from './viewports';
// https://github.com/tailwindlabs/tailwindcss/issues/6314#issuecomment-991093531
import '../src/styles/frostui.css';

const preview: Preview = {
  parameters: {
    // actions: { argTypesRegex: '^on.*' },
    // actions: { argTypesRegex: '^on[A-Z].*' },
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
      default: 'gradient-frost',
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
          name: 'gradient-frost',
          value:
            'linear-gradient(135deg, oklch(0.75 0.15 280) 0%, oklch(0.65 0.20 250) 50%, oklch(0.70 0.18 200) 100%)',
        },
        {
          name: 'gradient-aurora',
          value:
            'linear-gradient(135deg, oklch(0.65 0.25 300) 0%, oklch(0.60 0.22 260) 25%, oklch(0.70 0.20 200) 50%, oklch(0.65 0.18 180) 75%, oklch(0.70 0.22 220) 100%)',
        },
        {
          name: 'gradient-radial',
          value:
            'radial-gradient(circle at 30% 50%, oklch(0.70 0.22 280) 0%, oklch(0.60 0.25 250) 35%, oklch(0.50 0.20 220) 100%)',
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
            <SonnerToaster />
            {/* </div> */}
          </ThemeProvider>
        </React.Fragment>
      );
    },
  ],

  tags: ['autodocs'],
};

export default preview;
