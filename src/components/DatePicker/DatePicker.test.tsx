import * as React from 'react';
import { render } from '@testing-library/react';

import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('should render DatePicker component to match snapshot', () => {
    const result = render(<DatePicker buttonClassName="w-[240px]" />);
    expect(result).toMatchSnapshot();
  });
});
