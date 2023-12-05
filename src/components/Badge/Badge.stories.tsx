import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Card } from '../Card';
import { Badge } from './Badge';

type ComponentType = React.ComponentProps<typeof Badge> & { text?: string };
const meta: Meta<ComponentType> = {
  component: Badge,
  render: ({ text, ...args }) => (
    <Card className="flex items-center space-x-2 p-5">
      <Badge {...args}>{text}</Badge>
    </Card>
  ),
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
