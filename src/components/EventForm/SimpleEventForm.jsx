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
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-auto mx-4" 
        style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          pointerEvents: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">📝 Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="¿Qué evento vas a crear?"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">📄 Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                placeholder="Cuéntanos más detalles sobre tu evento..."
                rows={4}
              />
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">📅 Fecha *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">🕐 Hora *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  required
                />
              </div>
            </div>

            {/* Hora de fin */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">🕐 Hora de fin</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">📍 Ubicación</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="¿Dónde será el evento?"
              />
            </div>

            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">📧 Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">📱 Teléfono *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            {/* Categoría y Prioridad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">🏷️ Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <option value="work">💼 Trabajo</option>
                  <option value="personal">👤 Personal</option>
                  <option value="family">👨‍👩‍👧‍👦 Familia</option>
                  <option value="health">🏥 Salud</option>
                  <option value="education">📚 Educación</option>
                  <option value="entertainment">🎬 Entretenimiento</option>
                  <option value="sports">⚽ Deportes</option>
                  <option value="travel">✈️ Viajes</option>
                  <option value="other">🔖 Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">⚡ Prioridad</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <option value="low">🟢 Baja</option>
                  <option value="medium">🟡 Media</option>
                  <option value="high">🔴 Alta</option>
                </select>
              </div>
            </div>

            {/* Recordatorios */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">🔔 Recordatorios</label>
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                <label className="flex items-center cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    name="reminder_day"
                    checked={formData.reminder_day}
                    onChange={handleChange}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-base text-gray-700 font-medium">📅 Recordar el día del evento</span>
                </label>
                <label className="flex items-center cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    name="reminder_day_before"
                    checked={formData.reminder_day_before}
                    onChange={handleChange}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-base text-gray-700 font-medium">⏰ Recordar el día anterior</span>
                </label>
                <label className="flex items-center cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    name="is_all_day"
                    checked={formData.is_all_day}
                    onChange={handleChange}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-base text-gray-700 font-medium">🌅 Todo el día</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 border border-gray-300 hover:border-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {event ? '✏️ Actualizar' : '✨ Crear'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SimpleEventForm;