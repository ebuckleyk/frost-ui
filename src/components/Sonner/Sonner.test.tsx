import * as React from 'react';
import { render } from '@testing-library/react';
import { toast } from 'sonner';

import { Button } from '../Button';

function Component() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => undefined,
          },
        })
      }
    >
      Show Toast
    </Button>
  );
}
// TODO: render after click
describe('SonnerToaster', () => {
  it('should render SonnerToaster component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
