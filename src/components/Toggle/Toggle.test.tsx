import * as React from 'react';
import { FontBoldIcon } from '@radix-ui/react-icons';
import { render } from '@testing-library/react';

import { Toggle } from './Toggle';

function Component() {
  return (
    <Toggle aria-label="Toggle italic">
      <FontBoldIcon className="size-4" />
    </Toggle>
  );
}

describe('Toggle', () => {
  it('should render Toggle component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
