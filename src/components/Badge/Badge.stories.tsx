import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

type ComponentType = React.ComponentProps<typeof Badge> & { text?: string };
const meta: Meta<ComponentType> = {
  component: Badge,
  render: ({ text, ...args }) => <Badge {...args}>{text}</Badge>,
  argTypes: {
    variant: {
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<ComponentType>;

export const Demo: Story = {
  args: {
    text: 'Badge',
  },
};
