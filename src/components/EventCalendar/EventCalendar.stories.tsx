import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import { Meta, StoryObj } from '@storybook/react';
import { setDay } from 'date-fns';
import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import addMinutes from 'date-fns/addMinutes';
import format from 'date-fns/format';
import getWeek from 'date-fns/getWeek';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setWeek from 'date-fns/setWeek';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '../Button';
import { Calendar } from '../Calendar';
import { Card } from '../Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../Form';
import { Input } from '../Input';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { EventCalendar } from './EventCalendar';
import type { EventCalendarEvent } from './EventCalendar';

//#region EventData
const now = new Date();

const todayMorningEventStart = setHours(setMinutes(now, 30), 8);
const todayMorningEvent: EventCalendarEvent = {
  title: 'Morning Event',
  start: todayMorningEventStart,
  end: addHours(todayMorningEventStart, 1),
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FFA500',
  extendedProps: {
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Senectus et netus et malesuada fames ac. Massa tempor nec feugiat nisl pretium fusce
    id. At tellus at urna condimentum mattis pellentesque id nibh. Quis enim lobortis scelerisque fermentum dui
    faucibus. Convallis aenean et tortor at risus viverra. Nunc mattis enim ut tellus elementum sagittis vitae
    et. Odio euismod lacinia at quis risus sed. Eu lobortis elementum nibh tellus molestie nunc. Tincidunt arcu
    non sodales neque sodales ut etiam. Mi bibendum neque egestas congue. Vitae suscipit tellus mauris a diam
    maecenas sed enim ut. Nulla facilisi etiam dignissim diam quis enim. In arcu cursus euismod quis viverra
    nibh. Scelerisque fermentum dui faucibus in ornare quam. Viverra vitae congue eu consequat ac felis. Tellus
    molestie nunc non blandit massa enim. Libero justo laoreet sit amet cursus.`,
  },
};

const todayNoonEventStart = setHours(setMinutes(now, 15), 12);
const todayNoonEvent: EventCalendarEvent = {
  title: 'Noon Event',
  start: todayNoonEventStart,
  end: addMinutes(todayNoonEventStart, 30),
  editable: true,
  startEditable: true,
  durationEditable: true,
};

const todayafterNoonEventStart = setHours(setMinutes(now, 30), 15);
const afterNoonEvent: EventCalendarEvent = {
  title: 'Afternoon Event',
  start: todayafterNoonEventStart,
  end: addMinutes(todayafterNoonEventStart, 90),
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FF0000',
};

const eveningEventStart = setHours(setMinutes(now, 0), 17);
const eveningEvent: EventCalendarEvent = {
  title: 'Out of Office - ebuckleyk',
  start: eveningEventStart,
  end: addHours(eveningEventStart, 4),
  display: 'background',
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FFFFFF',
};

const vacationEventStart = setDay(setWeek(now, getWeek(now) + 2), 1);
const vacationStart: EventCalendarEvent = {
  title: 'Vacation - Bahamas - ebuckleyk',
  start: vacationEventStart,
  end: setDay(vacationEventStart, 6),
  allDay: true,
  display: 'background',
  editable: true,
  startEditable: true,
  durationEditable: true,
};

const releaseNightEventStart = setMinutes(setHours(setDay(setWeek(now, getWeek(now) + 1), 2), 23), 0);
const releaseNight: EventCalendarEvent = {
  title: 'Product Release Night',
  start: releaseNightEventStart,
  end: addMinutes(addHours(releaseNightEventStart, 2), 30),
  editable: true,
  startEditable: true,
  durationEditable: true,
};

const offsiteDay1EventStart = setHours(setMinutes(setDay(setWeek(now, getWeek(now) + 1), 2), 30), 9);
const offsiteDay1: EventCalendarEvent = {
  title: 'Product Offsite',
  start: offsiteDay1EventStart,
  end: addHours(offsiteDay1EventStart, 8),
  groupId: 'productOffsite',
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FFD700',
};

const offsiteDay2EventStart = addDays(offsiteDay1EventStart, 1);
const offsiteDay2: EventCalendarEvent = {
  title: 'Product Offsite',
  start: offsiteDay2EventStart,
  end: addHours(offsiteDay2EventStart, 8),
  groupId: 'productOffsite',
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FFD700',
};

const offsiteDay3EventStart = addDays(offsiteDay2EventStart, 1);
const offsiteDay3: EventCalendarEvent = {
  title: 'Product Offsite',
  start: offsiteDay3EventStart,
  end: addHours(offsiteDay3EventStart, 4),
  groupId: 'productOffsite',
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FFD700',
};

const events: EventCalendarEvent[] = [
  todayMorningEvent,
  todayNoonEvent,
  afterNoonEvent,
  eveningEvent,
  vacationStart,
  releaseNight,
  offsiteDay1,
  offsiteDay2,
  offsiteDay3,
];
//#endregion

const formSchema = z.object({
  title: z.string(),
  start: z.date(),
  end: z.date().optional(),
  eventColor: z.string().optional(),
});

const EventForm = ({ evt }: { evt?: EventCalendarEvent }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: evt?.title ?? '',
      start: evt?.start ? new Date(evt.start as string) : new Date(),
      end: evt?.end ? new Date(evt.end as string) : undefined,
      eventColor: evt?.borderColor ?? '',
    },
  });
  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div>
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Start</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={'outline'}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Start Date/Time</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={() => {}} initialFocus />
                        <Input type="time" />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>End</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={'outline'}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>End Date/Time</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={() => {}} initialFocus />
                        <Input type="time" />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="eventColor"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input type="color" className="w-2/12" {...field} defaultValue={'#ff0000'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

const CalendarDemo = () => {
  const ref = React.useRef<InstanceType<typeof FullCalendar>>(null);

  // const createEvent = React.useCallback(() => {}, []);

  return (
    <div className="space-y-3">
      <Card className="flex justify-center p-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <EventForm />
          </DialogContent>
        </Dialog>
      </Card>
      <Card className="p-5">
        <EventCalendar
          ref={ref}
          events={events}
          renderOnEventClick={(evet) => {
            return <EventForm evt={evet.toPlainObject()} />;
          }}
        />
      </Card>
    </div>
  );
};
type ComponentType = React.ComponentProps<typeof EventCalendar>;
const meta: Meta<ComponentType> = {
  component: EventCalendar,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: CalendarDemo,
};
