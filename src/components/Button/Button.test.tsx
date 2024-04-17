import * as React from 'react';
import { render } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('should render Button component to match snapshot', () => {
    const result = render(<Button>Yes</Button>);
    expect(result).toMatchSnapshot();
  });
});
