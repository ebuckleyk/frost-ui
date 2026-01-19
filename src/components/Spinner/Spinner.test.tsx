import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('should render Spinner component to match snapshot', () => {
    const result = render(<Spinner />);
    expect(result).toMatchSnapshot();
  });

  it('should render Spinner with custom size to match snapshot', () => {
    const result = render(<Spinner className="size-8" />);
    expect(result).toMatchSnapshot();
  });

  it('should render Spinner with custom color to match snapshot', () => {
    const result = render(<Spinner className="text-primary" />);
    expect(result).toMatchSnapshot();
  });
});
