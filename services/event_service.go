package services

import (
	"calendar-backend/models"
	"calendar-backend/repositories"
	"errors"
	"time"
)

// Interfaces específicas para cada operación
type EventCreator interface {
	CreateEvent(event *models.Event) error
}

type EventReader interface {
	GetEventByID(id uint) (*models.Event, error)
	GetAllEvents() ([]models.Event, error)
	GetEventsByDate(date string) ([]models.Event, error)
	GetTodayEvents() ([]models.Event, error)
	GetUpcomingEvents() ([]models.Event, error)
	GetEventsForDateRange(startDate, endDate string) ([]models.Event, error)
	SearchEvents(query string) ([]models.Event, error)
}

type EventUpdater interface {
	UpdateEvent(id uint, event *models.Event) error
}

type EventDeleter interface {
	DeleteEvent(id uint) error
}

type EventStatsProvider interface {
	GetEventStats() (map[string]interface{}, error)
}

// Interface principal que combina todas las operaciones
type EventService interface {
	EventCreator
	EventReader
	EventUpdater
	EventDeleter
	EventStatsProvider
}

type eventService struct {
	eventRepo           repositories.EventRepository
	creationService     *EventCreationService
	updateService       *EventUpdateService
	deletionService     *EventDeletionService
}

func NewEventService(eventRepo repositories.EventRepository) EventService {
	return &eventService{
		eventRepo:           eventRepo,
		creationService:     NewEventCreationService(eventRepo),
		updateService:       NewEventUpdateService(eventRepo),
		deletionService:     NewEventDeletionService(eventRepo),
	}
}

func (s *eventService) CreateEvent(event *models.Event) error {
	// Delegar al servicio específico de creación
	return s.creationService.CreateEvent(event)
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
	// Delegar al servicio específico de actualización
	return s.updateService.UpdateEvent(id, event)
}

func (s *eventService) DeleteEvent(id uint) error {
	// Delegar al servicio específico de eliminación
	return s.deletionService.DeleteEvent(id)
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
