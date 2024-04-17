import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Loader2, Mail } from 'lucide-react';

import { Button } from './Button';

function WithIconDemo() {
  return (
    <Button>
      <Mail className="mr-2 h-4 w-4" /> Login with Email
    </Button>
  );
}

function LoadingDemo() {
  return (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  );
}

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

export const Demo: Story = {
  args: {
    text: 'Button',
  },
};

export const WithIcon: Story = {
  render: WithIconDemo,
};

export const WithLoader: Story = {
  render: LoadingDemo,
};
