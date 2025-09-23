package handlers

import (
	"calendar-backend/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MobileHandler struct {
	db *gorm.DB
}

func NewMobileHandler(db *gorm.DB) *MobileHandler {
	return &MobileHandler{db: db}
}

// GetEventsForDateRange returns events for a specific date range (mobile optimized)
func (h *MobileHandler) GetEventsForDateRange(c *gin.Context) {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	if startDate == "" || endDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date and end_date are required"})
		return
	}

	start, err1 := time.Parse("2006-01-02", startDate)
	end, err2 := time.Parse("2006-01-02", endDate)

	if err1 != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	var events []models.Event
	if err := h.db.Where("date BETWEEN ? AND ?", start, end).
		Order("date ASC, time ASC").
		Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch events"})
		return
	}

	// Convert to mobile-optimized response
	responses := make([]models.EventResponse, len(events))
	for i, event := range events {
		responses[i] = event.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"events":     responses,
		"count":      len(responses),
		"start_date": startDate,
		"end_date":   endDate,
	})
}

// GetTodayEvents returns events for today (mobile optimized)
func (h *MobileHandler) GetTodayEvents(c *gin.Context) {
	today := time.Now()
	var events []models.Event

	if err := h.db.Where("DATE(date) = DATE(?)", today).
		Order("time ASC").
		Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch today's events"})
		return
	}

	responses := make([]models.EventResponse, len(events))
	for i, event := range events {
		responses[i] = event.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"events": responses,
		"count":  len(responses),
		"date":   today.Format("2006-01-02"),
	})
}

// GetUpcomingEvents returns upcoming events (mobile optimized)
func (h *MobileHandler) GetUpcomingEvents(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit := 10 // default value

	// Parse limit parameter
	if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
		limit = parsedLimit
	}

	var events []models.Event
	today := time.Now()

	if err := h.db.Where("date >= ?", today).
		Order("date ASC, time ASC").
		Limit(limit).
		Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch upcoming events"})
		return
	}

	responses := make([]models.EventResponse, len(events))
	for i, event := range events {
		responses[i] = event.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"events": responses,
		"count":  len(responses),
		"limit":  limit,
	})
}

// SearchEvents searches events by title or description (mobile optimized)
func (h *MobileHandler) SearchEvents(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query 'q' is required"})
		return
	}

	var events []models.Event
	searchQuery := "%" + query + "%"

	if err := h.db.Where("title LIKE ? OR description LIKE ?", searchQuery, searchQuery).
		Order("date ASC").
		Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search events"})
		return
	}

	responses := make([]models.EventResponse, len(events))
	for i, event := range events {
		responses[i] = event.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"events": responses,
		"count":  len(responses),
		"query":  query,
	})
}

// GetEventStats returns statistics for mobile dashboard
func (h *MobileHandler) GetEventStats(c *gin.Context) {
	today := time.Now()

	var stats struct {
		TotalEvents    int64 `json:"total_events"`
		TodayEvents    int64 `json:"today_events"`
		UpcomingEvents int64 `json:"upcoming_events"`
		PastEvents     int64 `json:"past_events"`
		HighPriority   int64 `json:"high_priority"`
		WithReminders  int64 `json:"with_reminders"`
	}

	// Total events
	h.db.Model(&models.Event{}).Count(&stats.TotalEvents)

	// Today's events
	h.db.Model(&models.Event{}).Where("DATE(date) = DATE(?)", today).Count(&stats.TodayEvents)

	// Upcoming events
	h.db.Model(&models.Event{}).Where("date > ?", today).Count(&stats.UpcomingEvents)

	// Past events
	h.db.Model(&models.Event{}).Where("date < ?", today).Count(&stats.PastEvents)

	// High priority events
	h.db.Model(&models.Event{}).Where("priority = ?", "high").Count(&stats.HighPriority)

	// Events with reminders
	h.db.Model(&models.Event{}).Where("reminder_day = ? OR reminder_day_before = ?", true, true).Count(&stats.WithReminders)

	c.JSON(http.StatusOK, stats)
}
