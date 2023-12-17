/* eslint-disable tailwindcss/no-custom-classname */
import * as React from 'react';
import { CalendarOptions, EventContentArg, EventInput, PluginDef } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  EditIcon,
  InfoIcon,
  LucideIcon,
  MapPinIcon,
  TagsIcon,
  UsersIcon,
} from 'lucide-react';

import { cn, getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/Sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ToggleGroup';

import { createContextScope, Scope } from '../../lib/createContext';

import './eventcalendar.css';

import { EventImpl } from '@fullcalendar/core/internal';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/Dialog';
import { ScrollArea } from '@/components/ScrollArea';

const DEFAULT_PLUGINS: PluginDef[] = [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, multiMonthPlugin];
enum CALENDAR_VIEW {
  MONTH = 'dayGridMonth',
  WEEK = 'timeGridWeek',
  DAY = 'timeGridDay',
  LIST = 'listWeek',
}

enum MOBILE_CALENDAR_VIEW {
  MONTH = 'listMonth',
  WEEK = 'listWeek',
  DAY = 'listDay',
}

type EventCalendarCategory = {
  id: string | number;
  name: string;
  color: string;
};
type EventCalendarAttendee = {
  id: string | number;
  name: string;
  imageUrl: string;
};
export type EventCalendarEvent = EventInput & {
  extendedProps?: Partial<Pick<EventImpl, 'extendedProps'>> & {
    category?: EventCalendarCategory;
    attendees?: EventCalendarAttendee[];
    description?: string;
  };
};

/**
 * Event Calendar
 */
const EVENTCALENDAR_NAME = 'EventCalendar';
type ScopedProps<P> = P & { __scopeEventCalendar?: Scope };
const [createEventCalendarContext, createEventCalendarScope] = createContextScope(EVENTCALENDAR_NAME);

type EventCalendarProps = CalendarOptions & {
  renderOnEventClick?: (event: EventImpl) => React.ReactNode;
};
type EventCalendarContextValue = EventCalendarState &
  EventCalendarProps & {
    calendar?: FullCalendar | null;
    renderOnEventClick?: (event: EventImpl) => React.ReactNode;
    goToNext: () => void;
    goToPrev: () => void;
    goToToday: () => void;
    changeView: (v: CALENDAR_VIEW) => void;
  };

type EventCalendarState = {
  currentCalendarDate?: Date;
  currentCalendarView?: CALENDAR_VIEW;
};

const [EventCalendarProvider, useEventCalendarContext] =
  createEventCalendarContext<EventCalendarContextValue>(EVENTCALENDAR_NAME);

const EventCalendar: React.FC<EventCalendarProps> = (props: ScopedProps<EventCalendarProps>) => {
  const [calendar, setCalendar] = React.useState<FullCalendar | undefined | null>();
  const [state, setState] = React.useState<EventCalendarState>({
    currentCalendarDate: new Date(),
    currentCalendarView: (props.initialView as CALENDAR_VIEW) ?? CALENDAR_VIEW.DAY,
  });

  const {
    __scopeEventCalendar,
    events,
    dayMaxEvents = 2,
    dayMaxEventRows = true,
    dayHeaders = true,
    stickyHeaderDates = true,
    nowIndicator = true,
  } = props;

  const ref = React.useRef<InstanceType<typeof FullCalendar>>(null);
  const api = React.useMemo(() => calendar?.getApi(), [calendar]);

  React.useEffect(() => {
    setCalendar(ref.current);
  }, []);

  const prev = React.useCallback(() => {
    api?.prev();
    setState((prevState) => ({ ...prevState, currentCalendarDate: api?.getDate() }));
  }, [api]);

  const next = React.useCallback(() => {
    api?.next();
    setState((prevState) => ({ ...prevState, currentCalendarDate: api?.getDate() }));
  }, [api]);

  const today = React.useCallback(() => {
    api?.today();
    setState((prevState) => ({ ...prevState, currentCalendarDate: api?.getDate() }));
  }, [api]);

  const changeView = React.useCallback(
    (v: CALENDAR_VIEW) => {
      if (!v || v === state.currentCalendarView) return;
      api?.changeView(v);
      setState((prevState) => ({ ...prevState, currentCalendarView: v }));
    },
    [api, state.currentCalendarView],
  );

  React.useEffect(() => {
    const date = api?.getDate();
    setState((prevState) => ({ ...prevState, currentCalendarDate: date }));
  }, [api]);

  return (
    <EventCalendarProvider
      scope={__scopeEventCalendar}
      events={events}
      calendar={calendar}
      goToPrev={prev}
      goToNext={next}
      goToToday={today}
      changeView={changeView}
      renderOnEventClick={props.renderOnEventClick}
      currentCalendarDate={state.currentCalendarDate}
      currentCalendarView={state.currentCalendarView}
    >
      <Card className="p-5">
        <EventCalendarToolbar />
        <FullCalendar
          ref={ref}
          plugins={DEFAULT_PLUGINS}
          initialView={state.currentCalendarView}
          headerToolbar={false}
          weekends={true}
          events={props.events}
          initialEvents={props.initialEvents}
          eventClassNames={cn('frostui-event', props.eventClassNames)}
          dayCellClassNames={cn('frostui-daycell', props.dayCellClassNames)}
          nowIndicatorClassNames={cn('frostui-nowindicator', props.nowIndicatorClassNames)}
          slotLaneClassNames={cn('frostui-slotLane', props.slotLaneClassNames)}
          viewClassNames={cn('frostui-view', props.viewClassNames)}
          allDayClassNames={cn('frostui-allday', props.allDayClassNames)}
          moreLinkClassNames={cn('frostui-morelink', props.moreLinkClassNames)}
          noEventsClassNames={cn('frostui-noevents', props.noEventsClassNames)}
          dayHeaderClassNames={cn('frostui-dayheader', props.dayHeaderClassNames)}
          slotLabelClassNames={cn('frostui-slotlabel', props.slotLabelClassNames)}
          weekNumberClassNames={cn('frostui-weeknumber', props.weekNumberClassNames)}
          dayMaxEvents={dayMaxEvents}
          dayMaxEventRows={dayMaxEventRows}
          dayHeaders={dayHeaders}
          stickyHeaderDates={stickyHeaderDates}
          allDayContent={() => <></>}
          nowIndicator={nowIndicator}
          eventClick={(info) => {
            info.jsEvent.preventDefault();
          }}
          eventContent={(args) => <ViewEventContent {...args} />}
          height={600}
        />
      </Card>
    </EventCalendarProvider>
  );
};

EventCalendar.displayName = EVENTCALENDAR_NAME;

/**
 * Event Content
 */
const getBorderColor = (borderColor: string) => {
  if (!borderColor) return 'border-blue-500';
  if (borderColor === 'white' || borderColor === 'black') return `border-${borderColor}`;
  return `border-${borderColor}-500`;
};

type EventContentProps = EventContentArg & {
  children?: React.ReactNode;
};

const VIEWEVENTCONTENT_NAME = 'ViewEventContent';
const ViewEventContent: React.FC<EventContentProps> = (props: ScopedProps<EventContentProps>) => {
  const { timeText, event, view } = props;
  const isBgEvent = event.display === 'background';

  const tailWindBorderColor = getBorderColor(event.borderColor);
  const tailWindAlign = view.type.includes('dayGridMonth') ? 'items-center' : 'align-middle';

  return (
    <Sheet>
      <SheetTrigger asChild className="z-50">
        <div className={`flex h-full w-full overflow-hidden ${tailWindAlign}`}>
          {view.type.includes('dayGridMonth') && !isBgEvent ? (
            <div className={`mx-1 my-0 box-content h-0 w-0 rounded-full border-[4px] ${tailWindBorderColor}`} />
          ) : null}
          <div className="mr-1 max-h-full shrink-0 grow-0 overflow-hidden whitespace-nowrap">{timeText}</div>
          <div className="min-h-0 shrink grow">
            <div className={`sticky inset-y-0 max-h-full overflow-hidden ${isBgEvent ? 'italic' : 'not-italic'}`}>
              {event.title}
            </div>
          </div>
        </div>
      </SheetTrigger>
      <EventContentInfo event={event} />
    </Sheet>
  );
};

ViewEventContent.displayName = VIEWEVENTCONTENT_NAME;

/**
 * Event Calendar Toolbar
 */
const EVENTCALENDARTOOLBAR_NAME = 'EventCalendarToolbar';
type EventCalendarToolbarProps = React.HtmlHTMLAttributes<HTMLDivElement>;

const getDateFormat = (date: Date, view: CALENDAR_VIEW): string => {
  switch (view) {
    case CALENDAR_VIEW.WEEK:
    case CALENDAR_VIEW.LIST:
      return `${format(startOfWeek(date), 'LLL dd')} - ${format(endOfWeek(date), 'dd, y')}`;
    case CALENDAR_VIEW.MONTH:
      return format(date, 'MMMM y');
    default:
      return format(date, 'MMMM dd, y');
  }
};
const EventCalendarToolbar: React.FC<EventCalendarToolbarProps> = (props: ScopedProps<EventCalendarToolbarProps>) => {
  const { currentCalendarDate, currentCalendarView, goToPrev, goToNext, changeView } = useEventCalendarContext(
    EVENTCALENDARTOOLBAR_NAME,
    props.__scopeEventCalendar,
  );

  React.useEffect(() => {}, [currentCalendarView]);

  const dateformat = React.useMemo(
    () => getDateFormat(currentCalendarDate ?? new Date(), currentCalendarView ?? CALENDAR_VIEW.DAY),
    [currentCalendarView, currentCalendarDate],
  );

  return (
    <div className="my-3 flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex items-center space-x-1">
        <Button onClick={goToPrev} size="icon" className="h-8 w-8">
          <ChevronLeft />
        </Button>
        <Button onClick={goToNext} size={'icon'} className="h-8 w-8">
          <ChevronRight />
        </Button>
        <div>{dateformat}</div>
      </div>
      <div className="hidden md:flex">
        <ToggleGroup onValueChange={changeView} value={currentCalendarView} type="single">
          <ToggleGroupItem value={CALENDAR_VIEW.MONTH}>Month</ToggleGroupItem>
          <ToggleGroupItem value={CALENDAR_VIEW.WEEK}>Week</ToggleGroupItem>
          <ToggleGroupItem value={CALENDAR_VIEW.DAY}>Day</ToggleGroupItem>
          <ToggleGroupItem value={CALENDAR_VIEW.LIST}>List</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex md:hidden">
        <ToggleGroup variant={'outline'} onValueChange={changeView} value={currentCalendarView} type="single">
          <ToggleGroupItem value={MOBILE_CALENDAR_VIEW.MONTH}>Month</ToggleGroupItem>
          <ToggleGroupItem value={MOBILE_CALENDAR_VIEW.WEEK}>Week</ToggleGroupItem>
          <ToggleGroupItem value={MOBILE_CALENDAR_VIEW.DAY}>Day</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

EventCalendarToolbar.displayName = EVENTCALENDARTOOLBAR_NAME;

/**
 * Event Content Info
 */

const EVENTCONTENTINFO_NAME = 'EventContentInfo';
type EventContentInfoProps = {
  event: EventImpl;
};

const EventContentInfo: React.FC<EventContentInfoProps> = (props: ScopedProps<EventContentInfoProps>) => {
  const { event } = props;

  const tailWindBorderColor = getBorderColor(event.borderColor);
  const attendees = (event.extendedProps ?? {}).attendees ?? [];
  const description = (event.extendedProps ?? {}).description;
  return (
    <SheetContent className="flex w-full flex-col gap-5 md:w-3/6">
      <EditEventContentInfo event={event} />
      <SheetHeader className="flex flex-row items-center">
        <div className="mt-1 flex items-center">
          <div className={`mx-1 mt-1 box-content h-0 w-0 rounded-full border-[4px] ${tailWindBorderColor}`} />
        </div>
        <div className="m-0 font-semibold">{event.title}</div>
      </SheetHeader>
      <SheetDescription>
        <span className="flex flex-col gap-4">
          <EventContentDescriptionItem className="" Icon={Calendar}>
            {event.start && format(event.start, 'MMMM dd, y EEEE')}
          </EventContentDescriptionItem>
          <EventContentDescriptionItem className="" Icon={Clock}>
            {`${event.start && format(event.start, 'p')}${event.start && event.end && ' - '}${
              event.end && format(event.end, 'p')
            }`}
          </EventContentDescriptionItem>
          <EventContentDescriptionItem className="" Icon={TagsIcon}>
            None
          </EventContentDescriptionItem>
          <EventContentDescriptionItem className="" Icon={MapPinIcon}>
            Virtual
          </EventContentDescriptionItem>
          <EventContentDescriptionItem
            className="items-start"
            Icon={() => (
              <span className="mr-2">
                <UsersIcon className="h-4 w-4" />
              </span>
            )}
          >
            <span>{attendees.length}</span>
            <ScrollArea className={`h-36 flex-wrap ${attendees.length ? 'flex' : 'hidden'}`}>
              {(attendees as EventCalendarAttendee[]).map((attendee) => {
                return <EventAttendee attendee={attendee} />;
              })}
            </ScrollArea>
          </EventContentDescriptionItem>
          <EventContentDescriptionItem
            className={`${description ? '' : 'hidden'} items-start`}
            Icon={() => (
              <span className="mr-2">
                <InfoIcon className="h-4 w-4" />
              </span>
            )}
          >
            {description}
          </EventContentDescriptionItem>
        </span>
      </SheetDescription>
    </SheetContent>
  );
};

EventContentInfo.displayName = EVENTCONTENTINFO_NAME;

type EventContentDescriptionItemProps = Pick<HTMLDivElement, 'className'> & {
  Icon: LucideIcon | (() => JSX.Element);
  children: React.ReactNode;
};
const EventContentDescriptionItem = (props: EventContentDescriptionItemProps) => {
  return (
    <span className={cn('inline-flex items-center', props.className)}>
      <props.Icon className={'mr-2 h-4 w-4'} />
      <span>{props.children}</span>
    </span>
  );
};

/**
 * Edit Event Content Info
 */
const EDITEVENTCONTENTINFO_NAME = 'EditEventContentInfo';
type EditEventContentInfoProps = {
  event: EventImpl;
};
const EditEventContentInfo: React.FC<EditEventContentInfoProps> = (props: ScopedProps<EditEventContentInfoProps>) => {
  const { renderOnEventClick } = useEventCalendarContext(EVENTCALENDAR_NAME, props.__scopeEventCalendar);
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="absolute right-12 top-4 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <div>
          <EditIcon className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        {renderOnEventClick && renderOnEventClick(props.event)}
      </DialogContent>
    </Dialog>
  );
};
EditEventContentInfo.displayName = EDITEVENTCONTENTINFO_NAME;

/**
 * Event Attendee
 */
const EVENTATTENDEE_NAME = 'EventAttendee';
type EventAttendeeProps = {
  attendee: EventCalendarAttendee;
};
const EventAttendee: React.FC<EventAttendeeProps> = (props: ScopedProps<EventAttendeeProps>) => {
  const { attendee } = props;
  const { imageUrl, name } = attendee;
  return (
    <Card className="inline-flex items-center rounded-full py-0 pr-1 text-xs">
      <Avatar className="mr-1">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      {name}
    </Card>
  );
};

EventAttendee.displayName = EVENTATTENDEE_NAME;
export { EventCalendar, createEventCalendarScope };

/**
 *             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Senectus et netus et malesuada fames ac. Massa tempor nec feugiat nisl pretium fusce
            id. At tellus at urna condimentum mattis pellentesque id nibh. Quis enim lobortis scelerisque fermentum dui
            faucibus. Convallis aenean et tortor at risus viverra. Nunc mattis enim ut tellus elementum sagittis vitae
            et. Odio euismod lacinia at quis risus sed. Eu lobortis elementum nibh tellus molestie nunc. Tincidunt arcu
            non sodales neque sodales ut etiam. Mi bibendum neque egestas congue. Vitae suscipit tellus mauris a diam
            maecenas sed enim ut. Nulla facilisi etiam dignissim diam quis enim. In arcu cursus euismod quis viverra
            nibh. Scelerisque fermentum dui faucibus in ornare quam. Viverra vitae congue eu consequat ac felis. Tellus
            molestie nunc non blandit massa enim. Libero justo laoreet sit amet cursus.
 */
