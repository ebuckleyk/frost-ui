import * as React from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible';

function CollapsibleDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="max-w-[380px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <CaretSortIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@radix-ui/primitives</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@radix-ui/colors</div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
type ComponentType = React.ComponentProps<typeof Collapsible>;
const meta: Meta<ComponentType> = {
  component: Collapsible,
  subcomponents: { CollapsibleContent, CollapsibleTrigger },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: CollapsibleDemo,
};
