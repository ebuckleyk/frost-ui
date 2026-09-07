import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Alert, AlertAction, AlertClose, AlertDescription, AlertTitle } from './Alert';

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

  it('renders a banner with actions and a labeled dismiss control', () => {
    const onDismiss = vi.fn();

    render(
      <Alert variant="destructive" layout="banner">
        <AlertTitle>Unable to save</AlertTitle>
        <AlertDescription>Try again.</AlertDescription>
        <AlertAction>
          <button type="button">Retry</button>
        </AlertAction>
        <AlertClose onClick={onDismiss} />
      </Alert>,
    );

    expect(screen.getByRole('alert')).toHaveAttribute('data-slot', 'alert');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();

    const dismiss = screen.getByRole('button', { name: 'Dismiss alert' });
    expect(dismiss).toHaveAttribute('type', 'button');
    fireEvent.click(dismiss);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('allows a less urgent semantic role', () => {
    render(
      <Alert role="status" layout="banner">
        <AlertTitle>Maintenance scheduled</AlertTitle>
      </Alert>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Maintenance scheduled');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps actions in the content column for a stacked banner', () => {
    render(
      <Alert layout="banner-stacked">
        <AlertTitle>Session expired</AlertTitle>
        <AlertDescription>Sign in again to continue.</AlertDescription>
        <AlertAction>
          <button type="button">Sign in again</button>
        </AlertAction>
      </Alert>,
    );

    const action = screen.getByRole('button', { name: 'Sign in again' }).parentElement;
    expect(action).toHaveAttribute('data-slot', 'alert-action');
    expect(action).toHaveClass('col-start-2');
  });
});
