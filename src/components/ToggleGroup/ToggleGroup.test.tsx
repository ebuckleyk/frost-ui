import * as React from 'react';
import { FontBoldIcon, FontItalicIcon, UnderlineIcon } from '@radix-ui/react-icons';
import { render } from '@testing-library/react';

import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

function Component() {
  return (
    <ToggleGroup type="single">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <FontBoldIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <FontItalicIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <UnderlineIcon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

describe('ToggleGroup', () => {
  it('should render ToggleGroup component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
