import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';

import { Button } from '../Button';

function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        })
      }
    >
      Show Toast
    </Button>
  );
}

type ComponentType = React.ComponentProps<typeof SonnerDemo>;
const meta: Meta<ComponentType> = {
  component: SonnerDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
