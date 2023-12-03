import * as React from 'react';
import type { Preview } from '@storybook/react';
import { Theme, ThemeProvider, useTheme } from '../src/components';

import '../src/styles/index.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      name: 'Localization',
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [{ values: 'en', right: 'us', title: 'English' }],
      },
    },
  },
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.parameters.theme ?? context.globals.theme;
      const storyTheme: Theme = theme === 'dark' ? 'dark' : 'light';
      return (
        <ThemeProvider theme={storyTheme}>
          {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
