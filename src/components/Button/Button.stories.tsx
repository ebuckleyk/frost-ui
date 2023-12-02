import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

type ComponentType = React.ComponentProps<typeof Button> & { text?: string };
const meta: Meta<ComponentType> = {
  component: Button,
  render: ({ text: buttonText, ...args }) => <Button {...args}>{buttonText}</Button>,
  argTypes: {
    variant: {
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<ComponentType>;

export const Default: Story = {
  args: {
    text: 'Button',
  },
};
