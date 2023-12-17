import * as React from 'react';
import FullCalendar from '@fullcalendar/react';

function useEventCalendar(calendar: React.RefObject<FullCalendar>) {
  const api = calendar.current?.getApi();

  const jumpToToday = React.useCallback(() => {
    api?.today();
  }, [api]);

  return {
    jumpToToday,
  };
}

export { useEventCalendar };
