import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Card } from '../Card';
import { Skeleton } from './Skeleton';

function SkeletonDemo() {
  return (
    <Card className="flex items-center space-x-4 p-10">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </Card>
  );
}

type ComponentType = React.ComponentProps<typeof Skeleton>;
const meta: Meta<ComponentType> = {
  component: Skeleton,
  render: SkeletonDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
