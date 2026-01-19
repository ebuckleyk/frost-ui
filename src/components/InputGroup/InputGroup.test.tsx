import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './InputGroup';

describe('InputGroup', () => {
  it('should render InputGroup component to match snapshot', () => {
    const result = render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="username" />
      </InputGroup>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render InputGroup with inline-end addon to match snapshot', () => {
    const result = render(
      <InputGroup>
        <InputGroupInput placeholder="amount" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render InputGroup with block-start addon to match snapshot', () => {
    const result = render(
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>Label</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="value" />
      </InputGroup>,
    );
    expect(result).toMatchSnapshot();
  });
});
