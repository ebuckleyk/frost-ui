import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from './Item';

describe('Item', () => {
  it('should render Item component to match snapshot', () => {
    const result = render(
      <Item>
        <ItemContent>
          <ItemTitle>Title</ItemTitle>
        </ItemContent>
      </Item>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render Item with description to match snapshot', () => {
    const result = render(
      <Item>
        <ItemContent>
          <ItemTitle>Title</ItemTitle>
          <ItemDescription>Description text</ItemDescription>
        </ItemContent>
      </Item>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render Item with icon media to match snapshot', () => {
    const result = render(
      <Item>
        <ItemMedia variant="icon">Icon</ItemMedia>
        <ItemContent>
          <ItemTitle>Title</ItemTitle>
        </ItemContent>
      </Item>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render Item with outline variant to match snapshot', () => {
    const result = render(
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Title</ItemTitle>
        </ItemContent>
      </Item>,
    );
    expect(result).toMatchSnapshot();
  });
});
