import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEvents } from '../../contexts/EventContext';
import EventForm from '../EventForm/EventForm';
import EventDetails from './EventDetails';

// Configurar moment para el calendario
moment.locale('es');
const localizer = momentLocalizer(moment);

const Calendar = () => {
  const { events, selectedEvent, setSelectedEvent, setSelectedDate } = useEvents();
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Convertir eventos al formato del calendario
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(`${event.date}T${event.time}`),
      end: new Date(`${event.date}T${event.end_time || event.time}`),
      resource: event,
    }));
  }, [events]);

  // Manejar selección de evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setShowEventDetails(true);
  };

  // Manejar selección de slot (crear nuevo evento)
  const handleSelectSlot = ({ start, end }) => {
    const startDate = moment(start).format('YYYY-MM-DD');
    const startTime = moment(start).format('HH:mm');
    const endTime = moment(end).format('HH:mm');
    
    setEditingEvent({
      date: startDate,
      time: startTime,
      end_time: endTime,
    });
    setShowEventForm(true);
  };

  // Manejar doble click en evento (editar)
  const handleDoubleClickEvent = (event) => {
    setEditingEvent(event.resource);
    setShowEventForm(true);
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  // Cerrar detalles
  const handleCloseDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  // Estilos personalizados para eventos
  const eventStyleGetter = (event) => {
    const backgroundColor = event.resource?.color || '#3b82f6';
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header del calendario */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <button
            onClick={() => setShowEventForm(true)}
            className="btn-primary"
          >
            + Nuevo Evento
          </button>
        </div>
      </div>

      {/* Calendario principal */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onDoubleClickEvent={handleDoubleClickEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            messages={{
              next: 'Siguiente',
              previous: 'Anterior',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay eventos en este rango',
              showMore: (total) => `+ Ver más (${total})`,
            }}
            culture="es"
          />
        </div>
      </div>

      {/* Formulario de evento */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          onClose={handleCloseForm}
        />
      )}

      {/* Detalles del evento */}
      {showEventDetails && selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={handleCloseDetails}
          onEdit={() => {
            setShowEventDetails(false);
            setEditingEvent(selectedEvent);
            setShowEventForm(true);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
