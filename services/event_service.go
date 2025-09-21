package services

import (
	"calendar-backend/models"
	"calendar-backend/repositories"
	"errors"
	"time"
)

type EventService interface {
	CreateEvent(event *models.Event) error
	GetEventByID(id uint) (*models.Event, error)
	GetAllEvents() ([]models.Event, error)
	GetEventsByDate(date string) ([]models.Event, error)
	UpdateEvent(id uint, event *models.Event) error
	DeleteEvent(id uint) error
	GetTodayEvents() ([]models.Event, error)
	GetUpcomingEvents() ([]models.Event, error)
	GetEventsForDateRange(startDate, endDate string) ([]models.Event, error)
	SearchEvents(query string) ([]models.Event, error)
	GetEventStats() (map[string]interface{}, error)
}

type eventService struct {
	eventRepo repositories.EventRepository
}

func NewEventService(eventRepo repositories.EventRepository) EventService {
	return &eventService{
		eventRepo: eventRepo,
	}
}

func (s *eventService) CreateEvent(event *models.Event) error {
	// Validaciones de negocio
	if event.Title == "" {
		return errors.New("title is required")
	}
	if event.Date.IsZero() {
		return errors.New("date is required")
	}
	if event.Time == "" {
		return errors.New("time is required")
	}

	// Validar formato de hora
	_, err := time.Parse("15:04", event.Time)
	if err != nil {
		return errors.New("invalid time format, use HH:MM")
	}

	// Establecer valores por defecto
	if event.Color == "" {
		event.Color = "#007AFF"
	}
	if event.Priority == "" {
		event.Priority = "medium"
	}

	return s.eventRepo.Create(event)
}

func (s *eventService) GetEventByID(id uint) (*models.Event, error) {
	if id == 0 {
		return nil, errors.New("invalid event ID")
	}
	return s.eventRepo.GetByID(id)
}

func (s *eventService) GetAllEvents() ([]models.Event, error) {
	return s.eventRepo.GetAll()
}

func (s *eventService) GetEventsByDate(date string) ([]models.Event, error) {
	// Validar formato de fecha
	_, err := time.Parse("2006-01-02", date)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}
	return s.eventRepo.GetByDate(date)
}

func (s *eventService) UpdateEvent(id uint, event *models.Event) error {
	if id == 0 {
		return errors.New("invalid event ID")
	}

	// Validar que el evento existe
	existingEvent, err := s.eventRepo.GetByID(id)
	if err != nil {
		return errors.New("event not found")
	}

	// Actualizar solo los campos proporcionados
	if event.Title != "" {
		existingEvent.Title = event.Title
	}
	if event.Description != "" {
		existingEvent.Description = event.Description
	}
	if !event.Date.IsZero() {
		existingEvent.Date = event.Date
	}
	if event.Time != "" {
		// Validar formato de hora
		_, err := time.Parse("15:04", event.Time)
		if err != nil {
			return errors.New("invalid time format, use HH:MM")
		}
		existingEvent.Time = event.Time
	}
	if event.Location != "" {
		existingEvent.Location = event.Location
	}
	if event.Email != "" {
		existingEvent.Email = event.Email
	}
	if event.Phone != "" {
		existingEvent.Phone = event.Phone
	}
	if event.Color != "" {
		existingEvent.Color = event.Color
	}
	if event.Priority != "" {
		existingEvent.Priority = event.Priority
	}
	if event.Category != "" {
		existingEvent.Category = event.Category
	}

	return s.eventRepo.Update(id, existingEvent)
}

func (s *eventService) DeleteEvent(id uint) error {
	if id == 0 {
		return errors.New("invalid event ID")
	}

	// Validar que el evento existe
	_, err := s.eventRepo.GetByID(id)
	if err != nil {
		return errors.New("event not found")
	}

	return s.eventRepo.Delete(id)
}

func (s *eventService) GetTodayEvents() ([]models.Event, error) {
	return s.eventRepo.GetTodayEvents()
}

func (s *eventService) GetUpcomingEvents() ([]models.Event, error) {
	return s.eventRepo.GetUpcomingEvents()
}

func (s *eventService) GetEventsForDateRange(startDate, endDate string) ([]models.Event, error) {
	// Validar formato de fechas
	_, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return nil, errors.New("invalid start date format, use YYYY-MM-DD")
	}
	_, err = time.Parse("2006-01-02", endDate)
	if err != nil {
		return nil, errors.New("invalid end date format, use YYYY-MM-DD")
	}
	return s.eventRepo.GetEventsForDateRange(startDate, endDate)
}

func (s *eventService) SearchEvents(query string) ([]models.Event, error) {
	if query == "" {
		return nil, errors.New("search query is required")
	}
	return s.eventRepo.SearchEvents(query)
}

func (s *eventService) GetEventStats() (map[string]interface{}, error) {
	return s.eventRepo.GetEventStats()
}
