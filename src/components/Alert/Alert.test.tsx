import * as React from 'react';
import { render } from '@testing-library/react';

import { Alert, AlertDescription, AlertTitle } from './Alert';

const Component = () => {
  return (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  );
};

describe('Alert', () => {
  it('should render Alert component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
