import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

type AccordionProps = React.ComponentProps<typeof Accordion>;

function AccordionDemo({ type, ...props }: AccordionProps) {
  return (
    <Accordion type={type} collapsible className="max-w-[380px]" {...props}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. It's animated by default, but you can disable it if you prefer.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
type ComponentType = React.ComponentProps<typeof Accordion>;
const meta: Meta<ComponentType> = {
  component: Accordion,
  subcomponents: { AccordionItem, AccordionContent, AccordionTrigger },
  render: ({ ...args }) => <AccordionDemo {...args} />,
  // argTypes: {
  //   type: {
  //     options: ['single', 'multiple'],
  //     control: { type: 'radio' },
  //   },
  // },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
