import * as React from 'react';
import type { Preview } from '@storybook/react-vite';

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
      options: viewports,
    },
    backgrounds: {
      options: {
        light: {
          name: 'light',
          value: '#F8F8F8',
        },
        dark: {
          name: 'dark',
          value: '#333333',
        },
        'cool-slate': {
          name: 'cool-slate',
          value: 'oklch(0.12 0.015 250)',
        },
        'frost-ambient': {
          name: 'frost-ambient',
          value:
            'radial-gradient(circle at 18% 0%, color-mix(in oklch, oklch(0.62 0.16 255) 3.5%, transparent), transparent 40%), radial-gradient(circle at 82% 0%, color-mix(in oklch, oklch(0.72 0.14 190) 4.5%, transparent), transparent 36%), linear-gradient(to bottom, color-mix(in oklch, oklch(0.62 0.16 255) 1.5%, transparent), transparent 34%), oklch(0.985 0.006 236)',
        },
        'frost-ambient-dark': {
          name: 'frost-ambient-dark',
          value:
            'radial-gradient(circle at 20% 10%, color-mix(in oklch, oklch(0.47 0.155 235) 6%, transparent), transparent 34%), radial-gradient(circle at 78% 0%, color-mix(in oklch, oklch(0.28 0.04 190) 6%, transparent), transparent 30%), oklch(0.13 0.018 245)',
        },
        'gradient-frost': {
          name: 'gradient-frost',
          value:
            'radial-gradient(circle at 16% 12%, oklch(0.78 0.08 245 / 0.24), transparent 34%), radial-gradient(circle at 84% 8%, oklch(0.82 0.07 185 / 0.18), transparent 30%), linear-gradient(135deg, oklch(0.96 0.018 245), oklch(0.91 0.022 215) 52%, oklch(0.94 0.016 185))',
        },
        'gradient-frost-dark': {
          name: 'gradient-frost-dark',
          value:
            'radial-gradient(circle at 16% 12%, oklch(0.55 0.1 245 / 0.2), transparent 34%), radial-gradient(circle at 84% 8%, oklch(0.58 0.08 185 / 0.16), transparent 30%), linear-gradient(135deg, oklch(0.18 0.022 248), oklch(0.14 0.018 226) 52%, oklch(0.16 0.016 198))',
        },
        'frost-purple': {
          name: 'frost-purple',
          value:
            'radial-gradient(circle at 18% 12%, oklch(0.76 0.09 302 / 0.2), transparent 34%), radial-gradient(circle at 82% 0%, oklch(0.74 0.08 258 / 0.18), transparent 32%), linear-gradient(135deg, oklch(0.96 0.018 292), oklch(0.92 0.022 270) 52%, oklch(0.94 0.018 235))',
        },
        'frost-purple-dark': {
          name: 'frost-purple-dark',
          value:
            'radial-gradient(circle at 18% 12%, oklch(0.58 0.14 302 / 0.22), transparent 34%), radial-gradient(circle at 82% 0%, oklch(0.54 0.11 258 / 0.2), transparent 32%), linear-gradient(135deg, oklch(0.18 0.03 292), oklch(0.14 0.025 270) 52%, oklch(0.16 0.02 235))',
        },
        image: {
          name: 'image',
          value:
            'url("https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")',
        },
      },
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
            <Story />
            <SonnerToaster />
          </ThemeProvider>
        </React.Fragment>
      );
    },
  ],

  tags: ['autodocs'],

  initialGlobals: {
    backgrounds: {
      value: 'frost-ambient',
    },
    theme: 'dark',
  },
};

export default preview;
