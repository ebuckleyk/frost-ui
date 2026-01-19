import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Spinner } from './Spinner';

function BasicDemo() {
  return <Spinner />;
}

function SizesDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
      <Spinner className="size-12" />
    </div>
  );
}

function ColorsDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner className="text-primary" />
      <Spinner className="text-destructive" />
      <Spinner className="text-muted-foreground" />
    </div>
  );
}

function InButtonDemo() {
  return (
    <div className="flex gap-4">
      <Button disabled>
        <Spinner className="mr-2" />
        Loading...
      </Button>
      <Button disabled variant="outline">
        <Spinner className="mr-2" />
        Please wait
      </Button>
    </div>
  );
}

function CenteredDemo() {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border">
      <Spinner className="size-8" />
    </div>
  );
}

const meta: Meta<typeof Spinner> = {
  component: Spinner,
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Demo: Story = {
  render: BasicDemo,
};

export const Sizes: Story = {
  render: SizesDemo,
};

export const Colors: Story = {
  render: ColorsDemo,
};

export const InButton: Story = {
  render: InButtonDemo,
};

export const Centered: Story = {
  render: CenteredDemo,
};
