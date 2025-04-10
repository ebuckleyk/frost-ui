import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { render } from '@testing-library/react';
import { format } from 'date-fns';

import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { Calendar } from '../Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';

const Component = () => {
  const [date, setDate] = React.useState<Date>();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

describe('DatePicker', () => {
  it('should render DatePicker component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
