import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Card } from '../Card';

type ComponentType = React.ComponentProps<typeof Button> & { text?: string };
const meta: Meta<ComponentType> = {
  component: Button,
  render: ({ text: buttonText, ...args }) => (
    <Card className="flex items-center space-x-2 p-5">
      <Button {...args}>{buttonText}</Button>
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
    text: 'Button',
  },
};
