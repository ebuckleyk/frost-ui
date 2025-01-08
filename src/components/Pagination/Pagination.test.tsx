import * as React from 'react';
import { render } from '@testing-library/react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination';

const Component = () => {
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
};

describe('Pagination', () => {
  it('should render Pagination component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
