import * as React from 'react';
import { render } from '@testing-library/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

const Component = () => {
  return (
    <Accordion type="single" collapsible className="min-w-fit">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible</AccordionTrigger>
        <AccordionContent>Yes</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>No</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

describe('Acordion', () => {
  it('should render Accordion component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
