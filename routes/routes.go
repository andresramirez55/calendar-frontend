package routes

import (
	"calendar-backend/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, eventHandler *handlers.EventHandler) {
	// API v1 group
	v1 := router.Group("/api/v1")
	{
		// Events endpoints
		events := v1.Group("/events")
		{
			events.POST("/", eventHandler.CreateEvent)
			events.GET("/", eventHandler.GetEvents)
			events.GET("/:id", eventHandler.GetEvent)
			events.PUT("/:id", eventHandler.UpdateEvent)
			events.DELETE("/:id", eventHandler.DeleteEvent)
		}
	}
}

func SetupMobileRoutes(router *gin.Engine, mobileHandler *handlers.MobileHandler) {
	// Mobile API group
	mobile := router.Group("/api/mobile")
	{
		// Mobile-optimized endpoints
		mobile.GET("/events/today", mobileHandler.GetTodayEvents)
		mobile.GET("/events/upcoming", mobileHandler.GetUpcomingEvents)
		mobile.GET("/events/range", mobileHandler.GetEventsForDateRange)
		mobile.GET("/events/search", mobileHandler.SearchEvents)
		mobile.GET("/stats", mobileHandler.GetEventStats)
	}
}

// SetupAllRoutes sets up both regular and mobile routes
func SetupAllRoutes(router *gin.Engine, eventHandler *handlers.EventHandler, mobileHandler *handlers.MobileHandler) {
	// Setup regular routes
	SetupRoutes(router, eventHandler)

	// Setup mobile routes
	SetupMobileRoutes(router, mobileHandler)

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Calendar API is running",
		})
	})

	// Root endpoint
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to Calendar API",
			"version": "1.0.0",
			"endpoints": gin.H{
				"events": "/api/v1/events",
				"mobile": "/api/mobile",
				"health": "/health",
			},
		})
	})
}
