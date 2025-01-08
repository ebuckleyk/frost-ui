import * as React from 'react';
import { render } from '@testing-library/react';

import { Checkbox } from '../Checkbox';
import { Label } from './Label';

const Component = () => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  );
};

describe('Label', () => {
  it('should render Label component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
