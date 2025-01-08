import * as React from 'react';
import { render } from '@testing-library/react';

import { Slider } from './Slider';

function Component() {
  return (
    <div className="w-[200px]">
      <Slider defaultValue={[50]} max={100} step={1} className={'w-[100%]'} />
    </div>
  );
}

describe('Slider', () => {
  it('should render Slider component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
