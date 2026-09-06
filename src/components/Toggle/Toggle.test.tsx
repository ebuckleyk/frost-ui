import * as React from 'react';
import { FontBoldIcon } from '@radix-ui/react-icons';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Toggle } from './Toggle';

function Component() {
  return (
    <Toggle aria-label="Toggle italic">
      <FontBoldIcon className="size-4" />
    </Toggle>
  );
}

describe('Toggle', () => {
  it('should render Toggle component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });

  it('exposes pressed state and primary selected-state semantics through pointer and keyboard interaction', async () => {
    const user = userEvent.setup();
    render(<Component />);
    const toggle = screen.getByRole('button', { name: 'Toggle italic' });

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('data-state', 'off');
    expect(toggle).toHaveAttribute('data-variant', 'default');
    expect(toggle).toHaveClass(
      'data-[state=on]:bg-primary/20',
      'data-[state=on]:text-primary',
      'data-[state=on]:hover:bg-primary/20',
      'aria-pressed:bg-primary/20',
      'aria-pressed:text-primary',
    );
    expect(toggle).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-[3px]', 'focus-visible:ring-ring/50');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).toHaveAttribute('data-state', 'on');

    await user.keyboard('[Space]');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('data-state', 'off');
  });

  it('retains a selected state without allowing interaction when disabled', async () => {
    const user = userEvent.setup();
    render(
      <Toggle pressed disabled aria-label="Disabled selected toggle">
        <FontBoldIcon className="size-4" />
      </Toggle>,
    );
    const toggle = screen.getByRole('button', { name: 'Disabled selected toggle' });

    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).toHaveAttribute('data-state', 'on');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('applies primary selected-state semantics to outline toggles', () => {
    render(<Toggle variant="outline" pressed aria-label="Selected outline toggle" />);
    const toggle = screen.getByRole('button', { name: 'Selected outline toggle' });
    expect(toggle).toHaveAttribute('data-variant', 'outline');
    expect(toggle).toHaveClass(
      'data-[state=on]:border-primary/65',
      'data-[state=on]:bg-primary/20',
      'data-[state=on]:text-primary',
    );
  });
});
