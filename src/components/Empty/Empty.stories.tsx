import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Search, FileX, Inbox } from 'lucide-react';

import { Button } from '../Button';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from './Empty';

function BasicDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Inbox className="size-12 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>You don't have any messages yet. Start a conversation to see them here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function WithIconVariantDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          We couldn't find what you're looking for. Try adjusting your search or filters.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function WithActionsDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <FileX className="size-12 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No files uploaded</EmptyTitle>
        <EmptyDescription>Get started by uploading your first file.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Upload File</Button>
        <Button variant="outline">Learn More</Button>
      </EmptyContent>
    </Empty>
  );
}

function WithLinkDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>All caught up!</EmptyTitle>
        <EmptyDescription>
          You've read all your notifications. <a href="#">View archive</a>
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

const meta: Meta<typeof Empty> = {
  component: Empty,
  subcomponents: { EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia },
};

export default meta;

type Story = StoryObj<typeof Empty>;

export const Demo: Story = {
  render: BasicDemo,
};

export const WithIconVariant: Story = {
  render: WithIconVariantDemo,
};

export const WithActions: Story = {
  render: WithActionsDemo,
};

export const WithLink: Story = {
  render: WithLinkDemo,
};
