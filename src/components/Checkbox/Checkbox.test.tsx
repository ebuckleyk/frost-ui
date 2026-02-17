import * as React from 'react';
import { render } from '@testing-library/react';

import { Checkbox } from './Checkbox';

const Component = () => {
  return (
    <div className="flex items-center space-x-2 p-5">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="
          text-sm leading-none font-medium
          peer-disabled:cursor-not-allowed peer-disabled:opacity-70
        "
      >
        Accept terms and conditions
      </label>
    </div>
  );
};

describe('Checkbox', () => {
  it('should render Checkbox component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
