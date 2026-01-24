import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '../Button';
import { Input } from '../Input';
import { toast } from '../Sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';

const formSchema = z.object({
  username: z.string().min(2).max(25),
});

function Component() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });
  // 2. Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    toast('You submitted', {
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

describe('Form', () => {
  it('should render Form component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
