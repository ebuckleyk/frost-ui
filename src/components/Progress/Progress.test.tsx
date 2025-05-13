import * as React from 'react';
import { render } from '@testing-library/react';

import { Progress } from './Progress';

function Component() {
  const [progress] = React.useState(13);

  return (
    <div className="min-w-[150px]">
      <Progress value={progress} className="w-full" />
    </div>
  );
}

describe('Progress', () => {
  it('should render Progress component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
