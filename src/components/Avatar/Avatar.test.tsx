import * as React from 'react';
import { render } from '@testing-library/react';

import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

const Component = () => {
  return (
    <Avatar>
      <AvatarImage src={'frost_ui.png'} alt="@ebuckleyk" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

describe('Avatar', () => {
  it('should render Avatar component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
