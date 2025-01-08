import * as React from 'react';
import { render } from '@testing-library/react';

import { Textarea } from './Textarea';

function Component() {
  return <Textarea className="w-[250px]" placeholder="Type your message here." />;
}

describe('Textarea', () => {
  it('should render Textarea component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
