import * as React from 'react';
import { render } from '@testing-library/react';

import { Label } from '../Label';
import { Switch } from './Switch';

function Component() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  );
}

describe('Switch', () => {
  it('should render Switch component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
