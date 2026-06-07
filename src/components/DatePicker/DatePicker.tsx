'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { Calendar } from '../Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';

type DatePickerProps = {
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  formatString?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  calendarClassName?: string;
  popoverContentClassName?: string;
} & Omit<React.ComponentProps<typeof Button>, 'onSelect' | 'value'>;

function DatePicker({
  date,
  defaultDate,
  onDateChange,
  placeholder = 'Pick a date',
  formatString = 'PPP',
  disabled,
  className,
  buttonClassName,
  calendarClassName,
  popoverContentClassName,
  ...props
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultDate);
  const selectedDate = date ?? internalDate;

  const handleSelect = React.useCallback(
    (nextDate: Date | undefined) => {
      if (date === undefined) {
        setInternalDate(nextDate);
      }

      onDateChange?.(nextDate);
    },
    [date, onDateChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-70 justify-start text-left font-normal',
            !selectedDate &&
              `
            text-muted-foreground
          `,
            className,
            buttonClassName,
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 size-4" />
          {selectedDate ? format(selectedDate, formatString) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', popoverContentClassName)} align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          captionLayout="dropdown"
          className={calendarClassName}
        />
      </PopoverContent>
    </Popover>
  );
}

function DatePickerDemo() {
  return <DatePicker />;
}

export { DatePicker, DatePickerDemo };
export type { DatePickerProps };
