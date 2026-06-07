import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { DatePicker } from './DatePicker';

function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();
  return <DatePicker date={date} onDateChange={setDate} buttonClassName="w-[240px]" />;
}
type ComponentType = React.ComponentProps<typeof DatePicker>;
const meta: Meta<ComponentType> = {
  component: DatePicker,
  render: DatePickerDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};
