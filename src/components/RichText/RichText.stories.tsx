import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '../Button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../Form';
import { toast } from '../Toast';
import { RichText, RichTextArea, RichTextToolbar } from './RichText';
import type { RichTextValue } from './RichText';

function RichTextDemo() {
  return (
    <RichText>
      <RichTextToolbar />
      <RichTextArea className="h-[250px] w-full" />
    </RichText>
  );
}
// .min(1, 'Text must be entered')
const formSchema = z.object({
  richText: z.custom<RichTextValue>().array().optional(),
});
function RichTextFormDemo() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: 'You submitted',
      description: (
        <pre>
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
          name="richText"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Rich Text</FormLabel>
                <FormControl>
                  <RichText
                    onBlur={field.onBlur}
                    readOnly={field.disabled}
                    onChange={(f) => {
                      form.setValue('richText', f);
                    }}
                  >
                    <RichTextToolbar />
                    <RichTextArea className="h-[250px] w-full" />
                  </RichText>
                </FormControl>
              </FormItem>
            );
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
type ComponentType = React.ComponentProps<typeof RichText>;
const meta: Meta<ComponentType> = {
  component: RichText,
  subcomponents: { RichTextArea, RichTextToolbar },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: RichTextDemo,
};

export const RichTextForm: Story = {
  render: RichTextFormDemo,
};
