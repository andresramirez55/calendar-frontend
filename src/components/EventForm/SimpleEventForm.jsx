import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEvents } from '../../contexts/EventContext';

const SimpleEventForm = ({ event, onClose }) => {
  const { createEvent, updateEvent } = useEvents();
  // Force update - mobile optimized form - v3 - $(Date.now())
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    end_time: '',
    location: '',
    email: '',
    phone: '',
    category: 'work',
    priority: 'medium',
    reminder_day: false,
    reminder_day_before: false,
    is_all_day: false
  });

  const [loading, setLoading] = useState(false);

  // Cargar datos del evento si estamos editando
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? event.date.split('T')[0] : '',
        time: event.time || '',
        end_time: event.end_time || '',
        location: event.location || '',
        email: event.email || '',
        phone: event.phone || '',
        category: event.category || 'work',
        priority: event.priority || 'medium',
        reminder_day: Boolean(event.reminder_day),
        reminder_day_before: Boolean(event.reminder_day_before),
        is_all_day: Boolean(event.is_all_day)
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar campos requeridos
      if (!formData.title || !formData.date || !formData.time) {
        alert('Por favor completa todos los campos requeridos');
        setLoading(false);
        return;
      }

      // Validar email si se proporciona
      if (formData.email && !formData.email.includes('@')) {
        alert('Por favor ingresa un email válido');
        setLoading(false);
        return;
      }

      // Validar teléfono si se proporciona
      if (formData.phone && formData.phone.length < 10) {
        alert('El teléfono debe tener al menos 10 caracteres');
        setLoading(false);
        return;
      }

      const eventData = {
        ...formData,
        date: formData.date, // Usar formato YYYY-MM-DD directamente
        email: formData.email || 'demo@ejemplo.com', // Email por defecto
        phone: formData.phone || '1234567890' // Teléfono por defecto
      };

      console.log('Enviando datos:', eventData);

      if (event) {
        // Actualizar evento existente
        await updateEvent(event.id, eventData);
      } else {
        // Crear nuevo evento
        await createEvent(eventData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`Error al guardar el evento: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        overflow: 'hidden',
        touchAction: 'none'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4" 
        style={{ 
          position: 'relative',
          zIndex: 10000,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          pointerEvents: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {event ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form - SÚPER SIMPLE */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Solo los campos esenciales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del evento"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="¿Dónde?"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (event ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SimpleEventForm;