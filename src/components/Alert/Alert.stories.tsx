import * as React from 'react';
import { Terminal } from 'lucide-react';
import { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from './Alert';

function AlertDemo(props) {
  return (
    <Alert {...props}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  );
}

type ComponentType = React.ComponentProps<typeof Alert>;
const meta: Meta<ComponentType> = {
  component: Alert,
  render: ({ ...args }) => <AlertDemo {...args} />,
  argTypes: {
    variant: {
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Default: Story = {};
