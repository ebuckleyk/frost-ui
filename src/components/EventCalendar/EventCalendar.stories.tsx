import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { setDay } from 'date-fns';
import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import addMinutes from 'date-fns/addMinutes';
import getWeek from 'date-fns/getWeek';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setWeek from 'date-fns/setWeek';

import { EventCalendar, EventCalendarEvent } from './EventCalendar';

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
  borderColor: 'orange',
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
  borderColor: 'white',
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

type ComponentType = React.ComponentProps<typeof EventCalendar>;
const meta: Meta<ComponentType> = {
  component: EventCalendar,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: () => {
    return (
      <EventCalendar
        events={events}
        renderOnEventClick={() => {
          return <div>Content!! Stories!!</div>;
        }}
      />
    );
  },
};
