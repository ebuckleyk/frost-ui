import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import { render } from '@testing-library/react';

import { EventCalendar, EventCalendarEvent } from './EventCalendar';

//#region EventData
const todayMorningEventStart = new Date('2025-01-08T14:30:22.687Z');
const todayMorningEvent: EventCalendarEvent = {
  title: 'Morning Event',
  start: todayMorningEventStart,
  end: new Date('2025-01-08T15:30:22.687Z'),
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

const todayNoonEventStart = new Date('2025-01-08T18:15:19.230Z');
const todayNoonEvent: EventCalendarEvent = {
  title: 'Noon Event',
  start: todayNoonEventStart,
  end: new Date('2025-01-08T18:45:19.230Z'),
  editable: true,
  startEditable: true,
  durationEditable: true,
};

const todayafterNoonEventStart = new Date('2025-01-08T21:30:20.379Z');
const afterNoonEvent: EventCalendarEvent = {
  title: 'Afternoon Event',
  start: todayafterNoonEventStart,
  end: new Date('2025-01-08T23:00:20.379Z'),
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FF0000',
};

const eveningEventStart = new Date('2025-01-08T23:00:10.714Z');
const eveningEvent: EventCalendarEvent = {
  title: 'Out of Office - ebuckleyk',
  start: eveningEventStart,
  end: new Date('2025-01-09T03:00:10.714Z'),
  display: 'background',
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FFFFFF',
};

const vacationEventStart = new Date('2025-01-20T06:09:56.666Z');
const vacationStart: EventCalendarEvent = {
  title: 'Vacation - Bahamas - ebuckleyk',
  start: vacationEventStart,
  end: new Date('2025-01-25T06:09:56.666Z'),
  allDay: true,
  display: 'background',
  editable: true,
  startEditable: true,
  durationEditable: true,
};

const releaseNightEventStart = new Date('2025-01-15T05:00:41.493Z');
const releaseNight: EventCalendarEvent = {
  title: 'Product Release Night',
  start: releaseNightEventStart,
  end: new Date('2025-01-15T07:30:41.493Z'),
  editable: true,
  startEditable: true,
  durationEditable: true,
};

const offsiteDay1EventStart = new Date('2025-01-14T15:30:17.428Z');
const offsiteDay1: EventCalendarEvent = {
  title: 'Product Offsite',
  start: offsiteDay1EventStart,
  end: new Date('2025-01-14T23:30:17.428Z'),
  groupId: 'productOffsite',
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FFD700',
};

const offsiteDay2EventStart = new Date('2025-01-15T15:30:17.428Z');
const offsiteDay2: EventCalendarEvent = {
  title: 'Product Offsite',
  start: offsiteDay2EventStart,
  end: new Date('2025-01-15T23:30:17.428Z'),
  groupId: 'productOffsite',
  editable: true,
  startEditable: true,
  durationEditable: true,
  borderColor: '#FFD700',
};

const offsiteDay3EventStart = new Date('2025-01-16T15:30:17.428Z');
const offsiteDay3: EventCalendarEvent = {
  title: 'Product Offsite',
  start: offsiteDay3EventStart,
  end: new Date('2025-01-16T19:30:17.428Z'),
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

const Component = () => {
  const ref = React.useRef<InstanceType<typeof FullCalendar>>(null);
  return <EventCalendar ref={ref} events={events} />;
};

describe('EventCalendar', () => {
  it('should render EventCalendar component to match snapshot', () => {
    const result = render(<Component />);
    expect(result).toMatchSnapshot();
  });
});
