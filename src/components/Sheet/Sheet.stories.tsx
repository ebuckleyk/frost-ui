import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

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

function SheetDemo(props: DemoProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent style={{ width: props.size }} side={props.side}>
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

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const;
type DemoProps = {
  side: 'top' | 'right' | 'bottom' | 'left' | undefined;
  size: string;
};
type ComponentType = React.ComponentProps<typeof Sheet> & DemoProps;
const meta: Meta<ComponentType> = {
  component: Sheet,
  subcomponents: { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger },
  argTypes: {
    side: {
      options: SHEET_SIDES,
      control: { type: 'radio' },
    },
    size: {
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: (props) => <SheetDemo {...props} />,
};

/** Localize the accessible name of the built-in icon button. */
export const LocalizedClose: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Ouvrir</Button>
      </SheetTrigger>
      <SheetContent closeLabel="Fermer">
        <SheetHeader>
          <SheetTitle>Préférences</SheetTitle>
          <SheetDescription>Modifiez vos préférences.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

/** Replace the built-in button with a localized, touch-sized SheetClose. */
export const CustomClose: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Ouvrir</Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Préférences</SheetTitle>
          <SheetDescription>Modifiez vos préférences.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="min-h-11 min-w-11">
              Fermer
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
