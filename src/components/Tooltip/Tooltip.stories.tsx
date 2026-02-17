import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
type ComponentType = React.ComponentProps<typeof Tooltip>;
const meta: Meta<ComponentType> = {
  component: Tooltip,
  subcomponents: { TooltipContent, TooltipProvider, TooltipTrigger },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: TooltipDemo,
};
