import * as React from 'react';
import { render } from '@testing-library/react';

import { Badge } from './Badge';

describe('Badge', () => {
  it('should render Badge component to match snapshot', () => {
    const result = render(<Badge>Hey</Badge>);
    expect(result).toMatchSnapshot();
  });
});
