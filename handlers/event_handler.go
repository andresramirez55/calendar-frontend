package handlers

import (
	"calendar-backend/handlers/dto"
	"calendar-backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type EventHandler struct {
	eventService services.EventService
}

func NewEventHandler(eventService services.EventService) *EventHandler {
	return &EventHandler{eventService: eventService}
}

func (h *EventHandler) CreateEvent(c *gin.Context) {
	var req dto.CreateEventRequest

	event, err := req.ProcessRequest(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.eventService.CreateEvent(event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Event created successfully",
		"event":   event,
	})
}

func (h *EventHandler) GetEvents(c *gin.Context) {
	var queryReq dto.GetEventsQueryRequest
	
	// Procesar query parameters
	if err := queryReq.ProcessQueryRequest(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Obtener tipo de consulta y parámetros
	queryType := queryReq.GetQueryType()
	search := queryReq.GetSearchQuery()
	date := queryReq.GetDate()
	startDate, endDate := queryReq.GetDateRange()

	// Usar el servicio para obtener eventos
	events, err := h.eventService.GetEventsByQuery(queryType, search, date, startDate, endDate)
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

	var req dto.UpdateEventRequest

	// Procesar request completo en el DTO
	event, err := req.ProcessRequest(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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
