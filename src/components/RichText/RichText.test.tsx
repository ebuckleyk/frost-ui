import * as React from 'react';
import { render } from '@testing-library/react';

import { RichText, RichTextArea, RichTextToolbar } from './RichText';

function Component() {
  return (
    <RichText>
      <RichTextToolbar />
      <RichTextArea className="h-[250px] w-full" />
    </RichText>
  );
}

describe('RichText', () => {
  it('should render RichText component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
