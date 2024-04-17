import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './Resizable';

function ResizableDemo() {
  return (
    <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
function VerticalResizeDemo() {
  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[200px] max-w-md rounded-lg border">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function WithHandleDemo() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[200px] max-w-md rounded-lg border">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

type ComponentType = React.ComponentProps<typeof ResizablePanelGroup>;
const meta: Meta<ComponentType> = {
  component: ResizablePanelGroup,
  subcomponents: { ResizableHandle, ResizablePanel },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: ResizableDemo,
};

export const Vertical: Story = {
  render: VerticalResizeDemo,
};

export const WithHandle: Story = {
  render: WithHandleDemo,
};
