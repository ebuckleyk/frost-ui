import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './Sheet';

function Component() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent style={{ width: 500 }} side={'left'}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('should render Sheet component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });

  function renderSheet(props: React.ComponentProps<typeof SheetContent> = {}) {
    render(
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent {...props}>
          <SheetTitle>Preferences</SheetTitle>
          <SheetDescription>Update your preferences.</SheetDescription>
          {props.children}
        </SheetContent>
      </Sheet>,
    );
    const trigger = screen.getByRole('button', { name: 'Open sheet' });
    fireEvent.click(trigger);
    return trigger;
  }

  it('keeps the default accessible close button and restores trigger focus', async () => {
    const trigger = renderSheet();
    expect(screen.getByRole('dialog', { name: 'Preferences' })).toHaveAccessibleDescription('Update your preferences.');
    fireEvent.click(screen.getByRole('button', { name: 'Close', exact: true }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('localizes the built-in close button without forwarding its options to the DOM', () => {
    renderSheet({ closeLabel: 'Fermer', showCloseButton: true });
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close', exact: true })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).not.toHaveAttribute('closeLabel');
    expect(screen.getByRole('dialog')).not.toHaveAttribute('showCloseButton');
  });

  it('supports a custom localized SheetClose without a duplicate close button', async () => {
    const trigger = renderSheet({
      showCloseButton: false,
      children: (
        <SheetClose asChild>
          <Button className="min-h-11 min-w-11">Fermer</Button>
        </SheetClose>
      ),
    });
    expect(screen.getAllByRole('button')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('preserves Escape dismissal and focus restoration with the built-in button hidden', async () => {
    const trigger = renderSheet({ showCloseButton: false });
    expect(screen.queryByRole('button', { name: 'Close', exact: true })).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
