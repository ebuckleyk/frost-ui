import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './Empty';

describe('Empty', () => {
  it('should render Empty component to match snapshot', () => {
    const result = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia>Icon</EmptyMedia>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>Try adjusting your search</EmptyDescription>
        </EmptyHeader>
      </Empty>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render Empty with icon variant to match snapshot', () => {
    const result = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">Icon</EmptyMedia>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>Try adjusting your search</EmptyDescription>
        </EmptyHeader>
      </Empty>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render Empty with content to match snapshot', () => {
    const result = render(
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No results</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>Content here</EmptyContent>
      </Empty>,
    );
    expect(result).toMatchSnapshot();
  });
});
