import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination';

function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious size="default" href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink size="default" href="#">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext size="default" href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
type ComponentType = React.ComponentProps<typeof Pagination>;
const meta: Meta<ComponentType> = {
  component: Pagination,
  render: PaginationDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
