package handlers

import (
	"calendar-backend/models"
	"calendar-backend/services"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type EventHandler struct {
	eventService services.EventService
}

func NewEventHandler(eventService services.EventService) *EventHandler {
	return &EventHandler{eventService: eventService}
}

// CreateEvent creates a new calendar event
func (h *EventHandler) CreateEvent(c *gin.Context) {
	var req models.CreateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse date
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	event := models.Event{
		Title:             req.Title,
		Description:       req.Description,
		Date:              date,
		Time:              req.Time,
		Location:          req.Location,
		Email:             req.Email,
		Phone:             req.Phone,
		ReminderDay:       req.ReminderDay,
		ReminderDayBefore: req.ReminderDayBefore,
	}

	if err := h.eventService.CreateEvent(&event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create event"})
		return
	}

	c.JSON(http.StatusCreated, event)
}

// GetEvents retrieves all events
func (h *EventHandler) GetEvents(c *gin.Context) {
	// Parse query parameters
	date := c.Query("date")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	search := c.Query("search")

	var events []models.Event
	var err error

	// Determine which service method to use based on query parameters
	if search != "" {
		// Search events
		events, err = h.eventService.SearchEvents(search)
	} else if date != "" {
		// Get events by specific date
		events, err = h.eventService.GetEventsByDate(date)
	} else if startDate != "" && endDate != "" {
		// Get events by date range
		events, err = h.eventService.GetEventsForDateRange(startDate, endDate)
	} else {
		// Get all events
		events, err = h.eventService.GetAllEvents()
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, events)
}

// GetEvent retrieves a specific event by ID
func (h *EventHandler) GetEvent(c *gin.Context) {
	idStr := c.Param("id")

	// Convert string ID to uint
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}

	event, err := h.eventService.GetEventByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, event)
}

// UpdateEvent updates an existing event
func (h *EventHandler) UpdateEvent(c *gin.Context) {
	idStr := c.Param("id")

	// Convert string ID to uint
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}

	var req models.UpdateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create event object with updated fields
	event := &models.Event{}

	// Update fields if provided
	if req.Title != nil {
		event.Title = *req.Title
	}
	if req.Description != nil {
		event.Description = *req.Description
	}
	if req.Date != nil {
		date, err := time.Parse("2006-01-02", *req.Date)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
			return
		}
		event.Date = date
	}
	if req.Time != nil {
		event.Time = *req.Time
	}
	if req.Location != nil {
		event.Location = *req.Location
	}
	if req.Email != nil {
		event.Email = *req.Email
	}
	if req.Phone != nil {
		event.Phone = *req.Phone
	}
	if req.ReminderDay != nil {
		event.ReminderDay = *req.ReminderDay
	}
	if req.ReminderDayBefore != nil {
		event.ReminderDayBefore = *req.ReminderDayBefore
	}
	if req.IsAllDay != nil {
		event.IsAllDay = *req.IsAllDay
	}
	if req.Color != nil {
		event.Color = *req.Color
	}
	if req.Priority != nil {
		event.Priority = *req.Priority
	}
	if req.Category != nil {
		event.Category = *req.Category
	}

	// Use service to update event
	if err := h.eventService.UpdateEvent(uint(id), event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get updated event to return
	updatedEvent, err := h.eventService.GetEventByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated event"})
		return
	}

	c.JSON(http.StatusOK, updatedEvent)
}

// DeleteEvent deletes an event
func (h *EventHandler) DeleteEvent(c *gin.Context) {
	idStr := c.Param("id")
	
	// Convert string ID to uint
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}

	// Use service to delete event
	if err := h.eventService.DeleteEvent(uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully"})
}
