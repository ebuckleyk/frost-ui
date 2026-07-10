import * as React from 'react';
import { render } from '@testing-library/react';

import { Calendar } from './Calendar';

const Component = () => {
  const date = new Date(2024, 4, 16, 23, 23, 23, 30);
  return (
    <Calendar
      mode="single"
      startMonth={new Date(2024, 4)}
      defaultMonth={new Date(2026, 5, 6)}
      selected={date}
      className="
      rounded-md border shadow-sm
    "
    />
  );
};

describe('Calendar', () => {
  beforeAll(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 5, 6, 12));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should render Calendar component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
