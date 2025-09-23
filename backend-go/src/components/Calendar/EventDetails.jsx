import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const EventDetails = ({ event, onClose, onEdit }) => {
  if (!event) return null;

  const formatDateTime = (date, time) => {
    if (!date || !time) return 'No especificado';
    const dateTime = new Date(`${date}T${time}`);
    return format(dateTime, 'PPP p', { locale: es });
  };

  const formatTime = (time) => {
    if (!time) return 'No especificado';
    return time;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalles del Evento
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-4">
          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="label">Título</label>
              <p className="text-gray-900 font-medium">{event.title}</p>
            </div>

            {/* Descripción */}
            {event.description && (
              <div>
                <label className="label">Descripción</label>
                <p className="text-gray-700">{event.description}</p>
              </div>
            )}

            {/* Fecha y hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Fecha</label>
                <p className="text-gray-700">{formatDateTime(event.date, event.time)}</p>
              </div>
              
              {event.end_time && (
                <div>
                  <label className="label">Hora de fin</label>
                  <p className="text-gray-700">{formatTime(event.end_time)}</p>
                </div>
              )}
            </div>

            {/* Ubicación */}
            {event.location && (
              <div>
                <label className="label">Ubicación</label>
                <p className="text-gray-700">{event.location}</p>
              </div>
            )}

            {/* Categoría */}
            {event.category && (
              <div>
                <label className="label">Categoría</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {event.category}
                </span>
              </div>
            )}

            {/* Prioridad */}
            {event.priority && (
              <div>
                <label className="label">Prioridad</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.priority === 'high' ? 'bg-red-100 text-red-800' :
                  event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {event.priority === 'high' ? 'Alta' :
                   event.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
            )}

            {/* Email */}
            {event.email && (
              <div>
                <label className="label">Email</label>
                <p className="text-gray-700">{event.email}</p>
              </div>
            )}

            {/* Teléfono */}
            {event.phone && (
              <div>
                <label className="label">Teléfono</label>
                <p className="text-gray-700">{event.phone}</p>
              </div>
            )}

            {/* Fecha de creación */}
            <div>
              <label className="label">Creado</label>
              <p className="text-gray-500 text-sm">
                {format(new Date(event.created_at), 'PPP p', { locale: es })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="btn-primary"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
