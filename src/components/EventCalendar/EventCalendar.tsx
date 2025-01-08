/* eslint-disable tailwindcss/no-custom-classname */
import * as React from 'react';
import { EventContentArg, EventInput, PluginDef } from '@fullcalendar/core';
import { EventImpl } from '@fullcalendar/core/internal';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/Dialog';
import { ScrollArea } from '@/components/ScrollArea';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/Sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ToggleGroup';

import { createContextScope, Scope } from '../../lib/createContext';

import './eventcalendar.css';

const DEFAULT_PLUGINS: PluginDef[] = [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, multiMonthPlugin];
const DEFAULT_COLOR = '#0000ff';

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

export enum CALENDAR_VIEW {
  MONTH = 'dayGridMonth',
  WEEK = 'timeGridWeek',
  DAY = 'timeGridDay',
  LIST = 'listWeek',
}

export enum MOBILE_CALENDAR_VIEW {
  MONTH = 'listMonth',
  WEEK = 'listWeek',
  DAY = 'listDay',
}

export type EventCalendarEvent = EventInput & {
  extendedProps?: Partial<Pick<EventInput, 'extendedProps'>> & {
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

export type EventCalendarProps = {
  renderOnEventClick?: (event: EventImpl) => React.ReactNode;
  initialView?: CALENDAR_VIEW;
  events?: EventInput[];
  initialEvents?: EventInput[];
  dayMaxEvents?: number;
  dayMaxEventRows?: boolean;
  dayHeaders?: boolean;
  stickyHeaderDates?: boolean;
  nowIndicator?: boolean;
};
type EventCalendarContextValue = EventCalendarState &
  EventCalendarProps & {
    renderOnEventClick?: (event: EventImpl) => React.ReactNode;
    goToNext: () => void;
    goToPrev: () => void;
    goToToday: () => void;
    changeView: (v: CALENDAR_VIEW) => void;
  };

type EventCalendarState = {
  currentCalendarDate?: Date;
  currentCalendarView?: CALENDAR_VIEW | MOBILE_CALENDAR_VIEW;
};

const [EventCalendarProvider, useEventCalendarContext] =
  createEventCalendarContext<EventCalendarContextValue>(EVENTCALENDAR_NAME);

const EventCalendar = React.forwardRef<React.ElementRef<typeof FullCalendar>, EventCalendarProps>(
  (props: ScopedProps<EventCalendarProps>, forwardRef) => {
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

    const internalRef = React.useRef<InstanceType<typeof FullCalendar>>(null);
    const ref: React.RefObject<FullCalendar | null> = forwardRef
      ? (forwardRef as React.RefObject<FullCalendar | null>)
      : internalRef;

    const api = React.useMemo(() => calendar?.getApi(), [calendar]);

    React.useEffect(() => {
      setCalendar(ref.current);
    }, [ref]);

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
        goToPrev={prev}
        goToNext={next}
        goToToday={today}
        changeView={changeView}
        renderOnEventClick={props.renderOnEventClick}
        currentCalendarDate={state.currentCalendarDate}
        currentCalendarView={state.currentCalendarView}
      >
        <EventCalendarToolbar />
        <FullCalendar
          ref={forwardRef}
          plugins={DEFAULT_PLUGINS}
          initialView={state.currentCalendarView}
          headerToolbar={false}
          weekends={true}
          events={props.events}
          initialEvents={props.initialEvents}
          eventClassNames={'frostui-event'}
          dayCellClassNames={'frostui-daycell'}
          nowIndicatorClassNames={'frostui-nowindicator'}
          slotLaneClassNames={'frostui-slotLane'}
          viewClassNames={'frostui-view'}
          allDayClassNames={'frostui-allday'}
          moreLinkClassNames={'frostui-morelink'}
          noEventsClassNames={'frostui-noevents'}
          dayHeaderClassNames={'frostui-dayheader'}
          slotLabelClassNames={'frostui-slotlabel'}
          weekNumberClassNames={'frostui-weeknumber'}
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
      </EventCalendarProvider>
    );
  },
);

EventCalendar.displayName = EVENTCALENDAR_NAME;

/**
 * Event Content
 */
type EventContentProps = EventContentArg & {
  children?: React.ReactNode;
};

const VIEWEVENTCONTENT_NAME = 'ViewEventContent';
const ViewEventContent: React.FC<EventContentProps> = (props: ScopedProps<EventContentProps>) => {
  const { timeText, event, view } = props;
  const isBgEvent = event.display === 'background';

  const tailWindAlign = view.type.includes('dayGridMonth') ? 'items-center' : 'align-middle';

  return (
    <Sheet>
      <SheetTrigger asChild className="z-50">
        <div className={`flex size-full overflow-hidden ${tailWindAlign}`}>
          {view.type.includes('dayGridMonth') && !isBgEvent ? (
            <div
              style={{
                borderColor: event.borderColor || DEFAULT_COLOR,
              }}
              className={'mx-1 my-0 box-content size-0 rounded-full border-4'}
            />
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

const getDateFormat = (date: Date, view: CALENDAR_VIEW | MOBILE_CALENDAR_VIEW): string => {
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
        <Button onClick={goToPrev} size="icon" className="size-8">
          <ChevronLeft />
        </Button>
        <Button onClick={goToNext} size={'icon'} className="size-8">
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

  const attendees = (event.extendedProps ?? {}).attendees ?? [];
  const description = (event.extendedProps ?? {}).description;
  return (
    <SheetContent className="flex w-full flex-col gap-5 md:w-3/6">
      <EditEventContentInfo event={event} />
      <SheetHeader className="flex flex-row items-center">
        <div className="mt-1 flex items-center">
          <div
            style={{ borderColor: event.borderColor || DEFAULT_COLOR }}
            className={'mx-1 mt-1 box-content size-0 rounded-full border-4'}
          />
        </div>
        <div className="m-0 font-semibold">{event.title}</div>
      </SheetHeader>
      <SheetDescription>
        <span className="flex flex-col gap-4">
          <EventContentDescriptionItem Icon={Calendar}>
            {event.start && format(event.start, 'MMMM dd, y EEEE')}
          </EventContentDescriptionItem>
          <EventContentDescriptionItem Icon={Clock}>
            {`${event.start && format(event.start, 'p')}${event.start && event.end && ' - '}${
              event.end && format(event.end, 'p')
            }`}
          </EventContentDescriptionItem>
          <EventContentDescriptionItem Icon={TagsIcon}>None</EventContentDescriptionItem>
          <EventContentDescriptionItem Icon={MapPinIcon}>Virtual</EventContentDescriptionItem>
          <EventContentDescriptionItem
            className="items-start"
            Icon={() => (
              <span className="mr-2">
                <UsersIcon className="size-4" />
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
                <InfoIcon className="size-4" />
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

type EventContentDescriptionItemProps = Partial<Pick<HTMLDivElement, 'className'>> & {
  Icon: LucideIcon | (() => React.ReactNode);
  children: React.ReactNode;
};
const EventContentDescriptionItem = (props: EventContentDescriptionItemProps) => {
  return (
    <span className={cn('inline-flex items-center', props.className)}>
      <props.Icon className={'mr-2 size-4'} />
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
          <EditIcon className="size-4" />
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
