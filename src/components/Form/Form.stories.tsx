import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '../Button';
import { Input } from '../Input';
import { toast } from '../Toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';

const formSchema = z.object({
  username: z.string().min(2).max(25),
});

function ProfileFormDemo() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });
  // 2. Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: 'You submitted',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="ebuckleyk" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

type ComponentType = React.ComponentProps<typeof Form>;
const meta: Meta<ComponentType> = {
  component: Form,
  render: ProfileFormDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
