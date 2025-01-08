import * as React from 'react';
import { render } from '@testing-library/react';

import { Input } from './Input';

describe('Input', () => {
  it('should render Input component to match snapshot', () => {
    const result = render(<Input />);
    expect(result).toMatchSnapshot();
  });
});
