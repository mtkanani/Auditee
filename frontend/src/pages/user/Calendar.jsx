import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents } from '../../services/eventService';
import './calendar.css';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async (info) => {
    const start = info.startStr;
    const end = info.endStr;
    try {
      const data = await getEvents({ start, end });
      const formatted = data.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        backgroundColor: getColor(e.type),
        borderColor: getColor(e.type),
        extendedProps: { metadata: e.metadata },
      }));
      setEvents(formatted);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'TASK':
        return '#0ea5e9';
      case 'COMPLIANCE':
        return '#f97316';
      case 'MEETING':
        return '#8b5cf6';
      case 'LEAVE':
        return '#ef4444';
      case 'CUSTOM':
        return '#2563eb';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="calendar-page">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        events={events}
        datesSet={fetchEvents}
        eventMouseEnter={(info) => {
          const { metadata } = info.event.extendedProps;
          if (metadata) {
            const tooltip = document.createElement('div');
            tooltip.className = 'event-tooltip';
            tooltip.innerHTML = `<pre>${JSON.stringify(metadata, null, 2)}</pre>`;
            document.body.appendChild(tooltip);
            const rect = info.el.getBoundingClientRect();
            tooltip.style.left = `${rect.right + 5}px`;
            tooltip.style.top = `${rect.top}px`;
            info.el._tooltip = tooltip;
          }
        }}
        eventMouseLeave={(info) => {
          if (info.el._tooltip) {
            document.body.removeChild(info.el._tooltip);
            delete info.el._tooltip;
          }
        }}
        height="calc(100vh - 120px)"
      />
    </div>
  );
};

export default CalendarPage;
