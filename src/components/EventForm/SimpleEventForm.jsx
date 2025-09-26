import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEvents } from '../../contexts/EventContext';

const SimpleEventForm = ({ event, onClose }) => {
  const { createEvent, updateEvent } = useEvents();
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
        reminder_day: event.reminder_day || false,
        reminder_day_before: event.reminder_day_before || false,
        is_all_day: event.is_all_day || false
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
        justifyContent: 'center'
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" 
        style={{ 
          position: 'relative', 
          zIndex: 10000,
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {event ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="label">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Título del evento"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="label">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Descripción del evento"
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Fecha y hora */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Fecha *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Hora *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Hora de fin */}
            <div>
              <label className="label">Hora de fin</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="label">Ubicación</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="Ubicación del evento"
              />
            </div>

            {/* Email y teléfono */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="email@ejemplo.com"
                  required
                />
              </div>
              <div>
                <label className="label">Teléfono *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            {/* Categoría y prioridad */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="work">Trabajo</option>
                  <option value="personal">Personal</option>
                  <option value="meeting">Reunión</option>
                  <option value="appointment">Cita</option>
                </select>
              </div>
              <div>
                <label className="label">Prioridad</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            {/* Recordatorios */}
            <div>
              <label className="label">Recordatorios</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="reminder_day"
                    checked={formData.reminder_day}
                    onChange={handleChange}
                  />
                  Recordar el día del evento
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="reminder_day_before"
                    checked={formData.reminder_day_before}
                    onChange={handleChange}
                  />
                  Recordar el día anterior
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="is_all_day"
                    checked={formData.is_all_day}
                    onChange={handleChange}
                  />
                  Todo el día
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
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
