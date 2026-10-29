import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents } from '../../services/eventService';
import { PageHeader } from '../../components/ui';
import './calendar.css';

const EVENT_TYPES = [
  { type: 'TASK', label: 'Tasks', color: '#0ea5e9' },
  { type: 'COMPLIANCE', label: 'Compliance', color: '#f97316' },
  { type: 'MEETING', label: 'Meetings', color: '#8b5cf6' },
  { type: 'LEAVE', label: 'Leave', color: '#ef4444' },
  { type: 'CUSTOM', label: 'Other', color: '#2563eb' },
];

const getColor = (type) => EVENT_TYPES.find((t) => t.type === type)?.color || '#64748b';

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

  return (
    <div className="space-y-5">
      <PageHeader title="Calendar" description="Tasks, compliance due dates, meetings and leave on one calendar." />

      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted" aria-label="Event colours">
        {EVENT_TYPES.map((t) => (
          <li key={t.type} className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} aria-hidden="true" />
            {t.label}
          </li>
        ))}
      </ul>

      <div className="calendar-page">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          buttonText={{ today: 'Today', month: 'Month', week: 'Week', day: 'Day' }}
          events={events}
          datesSet={fetchEvents}
          eventMouseEnter={(info) => {
            const { metadata } = info.event.extendedProps;
            if (metadata) {
              const tooltip = document.createElement('div');
              tooltip.className = 'event-tooltip';
              const pre = document.createElement('pre');
              pre.textContent = JSON.stringify(metadata, null, 2);
              tooltip.appendChild(pre);
              document.body.appendChild(tooltip);
              const rect = info.el.getBoundingClientRect();
              tooltip.style.left = `${rect.right + 5 + window.scrollX}px`;
              tooltip.style.top = `${rect.top + window.scrollY}px`;
              info.el._tooltip = tooltip;
            }
          }}
          eventMouseLeave={(info) => {
            if (info.el._tooltip) {
              info.el._tooltip.remove();
              delete info.el._tooltip;
            }
          }}
          height="calc(100vh - 220px)"
        />
      </div>
    </div>
  );
};

export default CalendarPage;
