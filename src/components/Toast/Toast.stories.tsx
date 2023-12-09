import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Toast } from './Toast';
import { useToast } from './use-toast';

function ToastDemo() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() => {
        toast({
          title: 'Scheduled: Catch up',
          description: 'Friday, February 10, 2023 at 5:57 PM',
        });
      }}
    >
      Show Toast
    </Button>
  );
}
type ComponentType = React.ComponentProps<typeof Toast>;
const meta: Meta<ComponentType> = {
  component: Toast,
  render: ToastDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
