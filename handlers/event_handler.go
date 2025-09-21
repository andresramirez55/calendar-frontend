package handlers

import (
	"calendar-backend/models"
	"calendar-backend/services"
	"net/http"
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

	if err := h.db.Create(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create event"})
		return
	}

	c.JSON(http.StatusCreated, event)
}

// GetEvents retrieves all events
func (h *EventHandler) GetEvents(c *gin.Context) {
	var events []models.Event

	// Parse query parameters
	date := c.Query("date")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	query := h.db

	if date != "" {
		parsedDate, err := time.Parse("2006-01-02", date)
		if err == nil {
			query = query.Where("DATE(date) = DATE(?)", parsedDate)
		}
	}

	if startDate != "" && endDate != "" {
		start, err1 := time.Parse("2006-01-02", startDate)
		end, err2 := time.Parse("2006-01-02", endDate)
		if err1 == nil && err2 == nil {
			query = query.Where("date BETWEEN ? AND ?", start, end)
		}
	}

	if err := query.Order("date ASC, time ASC").Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch events"})
		return
	}

	c.JSON(http.StatusOK, events)
}

// GetEvent retrieves a specific event by ID
func (h *EventHandler) GetEvent(c *gin.Context) {
	id := c.Param("id")

	var event models.Event
	if err := h.db.First(&event, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch event"})
		return
	}

	c.JSON(http.StatusOK, event)
}

// UpdateEvent updates an existing event
func (h *EventHandler) UpdateEvent(c *gin.Context) {
	id := c.Param("id")

	var event models.Event
	if err := h.db.First(&event, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch event"})
		return
	}

	var req models.UpdateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

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

	if err := h.db.Save(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update event"})
		return
	}

	c.JSON(http.StatusOK, event)
}

// DeleteEvent deletes an event
func (h *EventHandler) DeleteEvent(c *gin.Context) {
	id := c.Param("id")

	var event models.Event
	if err := h.db.First(&event, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch event"})
		return
	}

	if err := h.db.Delete(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully"})
}
