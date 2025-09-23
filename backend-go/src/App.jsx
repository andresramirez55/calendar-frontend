import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  // Cargar eventos al montar el componente
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/events/');
      if (!response.ok) throw new Error('Error al cargar eventos');
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear evento');
      }
      
      const result = await response.json();
      setEvents([...events, result.event]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar evento');
      }
      
      const result = await response.json();
      setEvents(events.map(event => event.id === id ? result : event));
      setShowForm(false);
      setEditingEvent(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/events/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar evento');
      
      setEvents(events.filter(event => event.id !== id));
      setShowDetails(false);
      setSelectedEvent(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <h1>📅 Calendar App</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Nuevo Evento
        </button>
      </header>

      {/* Main content */}
      <main className="main">
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <div className="calendar-container">
          <h2>Eventos</h2>
          {events.length === 0 ? (
            <p>No hay eventos. ¡Crea tu primer evento!</p>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              {events.map(event => (
                <div 
                  key={event.id} 
                  style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '1rem', 
                    marginBottom: '1rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewEvent(event)}
                >
                  <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>
                    {event.title}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                    {event.description}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#999' }}>
                    📅 {new Date(event.date).toLocaleDateString()} 
                    {event.time && ` 🕐 ${event.time}`}
                    {event.location && ` 📍 ${event.location}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? 
            (data) => updateEvent(editingEvent.id, data) : 
            createEvent
          }
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}

      {/* Event Details Modal */}
      {showDetails && selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => {
            setShowDetails(false);
            setSelectedEvent(null);
          }}
          onEdit={() => handleEditEvent(selectedEvent)}
          onDelete={() => deleteEvent(selectedEvent.id)}
        />
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="loading">
          <div className="loading-content">
            <div className="spinner"></div>
            <span>Cargando...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente del formulario de eventos
function EventForm({ event, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    end_time: '',
    location: '',
    category: '',
    priority: 'medium',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? event.date.split('T')[0] : '',
        time: event.time || '',
        end_time: event.end_time || '',
        location: event.location || '',
        category: event.category || '',
        priority: event.priority || 'medium',
        email: event.email || '',
        phone: event.phone || '',
      });
    } else {
      // Valores por defecto para nuevo evento
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toTimeString().slice(0, 5);
      setFormData(prev => ({
        ...prev,
        date: today,
        time: now,
      }));
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{event ? 'Editar Evento' : 'Nuevo Evento'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Hora *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Hora de fin</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Ubicación</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Seleccionar categoría</option>
                <option value="work">Trabajo</option>
                <option value="personal">Personal</option>
                <option value="meeting">Reunión</option>
                <option value="appointment">Cita</option>
                <option value="reminder">Recordatorio</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prioridad</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-control"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="btn-group">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {event ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente de detalles del evento
function EventDetails({ event, onClose, onEdit, onDelete }) {
  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'badge-danger',
      medium: 'badge-warning',
      low: 'badge-success'
    };
    return badges[priority] || 'badge-primary';
  };

  const getPriorityText = (priority) => {
    const texts = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return texts[priority] || priority;
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Detalles del Evento</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="event-details">
          <h4>{event.title}</h4>
          {event.description && <p>{event.description}</p>}
          
          <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
          {event.time && <p><strong>Hora:</strong> {event.time}</p>}
          {event.end_time && <p><strong>Hora de fin:</strong> {event.end_time}</p>}
          {event.location && <p><strong>Ubicación:</strong> {event.location}</p>}
          {event.category && <p><strong>Categoría:</strong> {event.category}</p>}
          {event.priority && (
            <p>
              <strong>Prioridad:</strong> 
              <span className={`badge ${getPriorityBadge(event.priority)}`} style={{ marginLeft: '0.5rem' }}>
                {getPriorityText(event.priority)}
              </span>
            </p>
          )}
          {event.email && <p><strong>Email:</strong> {event.email}</p>}
          {event.phone && <p><strong>Teléfono:</strong> {event.phone}</p>}
        </div>

        <div className="btn-group">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn btn-primary" onClick={onEdit}>
            Editar
          </button>
          <button className="btn btn-danger" onClick={onDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;