import * as React from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { render } from '@testing-library/react';

import { Button } from '../Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible';

const Component = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="
      max-w-[380px] space-y-2
    "
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <CaretSortIcon className="size-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-xs">@radix-ui/primitives</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-xs">@radix-ui/colors</div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-xs">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

describe('Collapsible', () => {
  it('should render Collapsible component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
