import * as React from 'react';
import { render } from '@testing-library/react';

import { Calendar } from './Calendar';

const Component = () => {
  const date = new Date(2024, 4, 16, 23, 23, 23, 30);
  return <Calendar mode="single" startMonth={new Date(2024, 4)} selected={date} className="rounded-md border shadow-sm" />;
};

describe('Calendar', () => {
  it('should render Calendar component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
