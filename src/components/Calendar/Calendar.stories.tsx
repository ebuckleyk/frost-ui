import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { addDays, format } from 'date-fns';
import { Calendar } from './Calendar';
import { Card } from '../Card';
import { DateRange } from 'react-day-picker';

function SingleDayCalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Card>
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border shadow" />
    </Card>
  );
}

function MultiDayCalendarDemo() {
  const initialDays: Date[] = [];
  const [days, setDays] = React.useState<Date[] | undefined>(initialDays);

  const footer = days && days.length ? <p>You selected {days.length} day(s).</p> : <p>Please pick one or more days.</p>;
  return (
    <Card>
      <Calendar
        footer={footer}
        mode="multiple"
        min={1}
        selected={days}
        onSelect={setDays}
        className="rounded-md border shadow"
      />
    </Card>
  );
}

const pastMonth = new Date(2020, 10, 15);

function RangeCalendarDemo() {
  const defaultSelected: DateRange = {
    from: pastMonth,
    to: addDays(pastMonth, 4),
  };
  const [range, setRange] = React.useState<DateRange | undefined>(defaultSelected);

  let footer = <p>Please pick the first day.</p>;
  if (range?.from) {
    if (!range.to) {
      footer = <p>{format(range.from, 'PPP')}</p>;
    } else if (range.to) {
      footer = (
        <p>
          {format(range.from, 'PPP')}–{format(range.to, 'PPP')}
        </p>
      );
    }
  }

  return (
    <Card>
      <Calendar
        mode="range"
        defaultMonth={pastMonth}
        selected={range}
        footer={footer}
        onSelect={setRange}
        className="rounded-md border shadow"
      />
    </Card>
  );
}

type ComponentType = React.ComponentProps<typeof Calendar>;
const meta: Meta<ComponentType> = {
  component: Calendar,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const SingleDayPicker: Story = {
  render: SingleDayCalendarDemo,
};

export const MultipleDayPicker: Story = {
  render: MultiDayCalendarDemo,
};

export const DayRangePicker: Story = {
  render: RangeCalendarDemo,
};
