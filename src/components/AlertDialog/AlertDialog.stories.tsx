import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from './AlertDialog';
import { Button } from '../Button';
import { Card } from '../Card';

function AlertDialogDemo() {
  return (
    <Card className="flex justify-items-center p-5">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
type ComponentType = React.ComponentProps<typeof AlertDialog>;
const meta: Meta<ComponentType> = {
  component: AlertDialog,
  render: AlertDialogDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
