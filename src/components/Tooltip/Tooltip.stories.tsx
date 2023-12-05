import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Card } from '../Card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

function TooltipDemo() {
  return (
    <Card className="p-10">
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
    </Card>
  );
}
type ComponentType = React.ComponentProps<typeof Tooltip>;
const meta: Meta<ComponentType> = {
  component: Tooltip,
  render: TooltipDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
