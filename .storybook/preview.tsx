import * as React from 'react';
import type { Preview } from '@storybook/react';

import { Card, CardContent, CardHeader } from '../src/components/Card';
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
      const title = context.title.includes('/') ? context.title.split('/')[1] : context.title;

      return (
        <React.Fragment>
          <Card className="p-5">
            <CardHeader>{title}</CardHeader>
            <CardContent>
              <Story />
            </CardContent>
          </Card>
          <Toaster />
        </React.Fragment>
      );
    },
  ],
};

export default preview;
