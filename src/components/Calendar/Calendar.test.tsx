import * as React from 'react';
import { render } from '@testing-library/react';

import { Calendar } from './Calendar';

const Component = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border shadow" />;
};

describe('Calendar', () => {
  it('should render Calendar component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
