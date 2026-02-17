import * as React from 'react';
import { render } from '@testing-library/react';

import { Skeleton } from './Skeleton';

function Component() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

describe('Skeleton', () => {
  it('should render Skeleton component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
