import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../Button';
import { ButtonGroup, ButtonGroupSeparator } from './ButtonGroup';

describe('ButtonGroup', () => {
  it('should render ButtonGroup component to match snapshot', () => {
    const result = render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render vertical ButtonGroup to match snapshot', () => {
    const result = render(
      <ButtonGroup orientation="vertical">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>,
    );
    expect(result).toMatchSnapshot();
  });

  it('should render ButtonGroup with separator to match snapshot', () => {
    const result = render(
      <ButtonGroup>
        <Button>First</Button>
        <ButtonGroupSeparator />
        <Button>Second</Button>
      </ButtonGroup>,
    );
    expect(result).toMatchSnapshot();
  });
});
