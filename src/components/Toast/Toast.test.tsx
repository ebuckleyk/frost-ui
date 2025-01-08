import * as React from 'react';
import { render } from '@testing-library/react';

import { Button } from '../Button';
import { Toaster } from './Toaster';
import { useToast } from './use-toast';

function Component() {
  const { toast } = useToast();
  return (
    <div>
      <Button
        onClick={() => {
          toast({
            title: 'Scheduled: Catch up',
            description: 'Friday, February 10, 2023 at 5:57 PM',
          });
        }}
      >
        Show Toast
      </Button>
      <Toaster />
    </div>
  );
}

describe('Toast', () => {
  it('should render Toast component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
