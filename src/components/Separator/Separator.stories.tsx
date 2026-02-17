import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from './Separator';

function SeparatorDemo() {
  return (
    <>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </>
  );
}

type ComponentType = React.ComponentProps<typeof Separator>;
const meta: Meta<ComponentType> = {
  component: Separator,
  render: SeparatorDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
