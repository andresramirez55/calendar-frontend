package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	ID                uint      `json:"id" gorm:"primaryKey"`
	Title             string    `json:"title" gorm:"not null"`
	Description       string    `json:"description"`
	Date              time.Time `json:"date" gorm:"not null"`
	Time              string    `json:"time"` // Format: "HH:MM"
	Location          string    `json:"location"`
	Email             string    `json:"email" gorm:"not null"`
	Phone             string    `json:"phone" gorm:"not null"`
	ReminderDay       bool      `json:"reminder_day" gorm:"default:true"`        // Reminder on the same day
	ReminderDayBefore bool      `json:"reminder_day_before" gorm:"default:true"` // Reminder one day before
	// Campos móviles adicionales
	IsAllDay  bool           `json:"is_all_day" gorm:"default:false"`  // Evento de todo el día
	Color     string         `json:"color" gorm:"default:'#007AFF'"`   // Color del evento
	Priority  string         `json:"priority" gorm:"default:'medium'"` // Prioridad: low, medium, high
	Category  string         `json:"category"`                         // Categoría del evento
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

type CreateEventRequest struct {
	Title             string `json:"title" binding:"required"`
	Description       string `json:"description"`
	Date              string `json:"date" binding:"required"` // Format: "2006-01-02"
	Time              string `json:"time"`                    // Format: "HH:MM" (optional if is_all_day)
	Location          string `json:"location"`
	Email             string `json:"email" binding:"required,email"`
	Phone             string `json:"phone" binding:"required"`
	ReminderDay       bool   `json:"reminder_day"`
	ReminderDayBefore bool   `json:"reminder_day_before"`
	// Campos móviles
	IsAllDay bool   `json:"is_all_day"`
	Color    string `json:"color"`
	Priority string `json:"priority"`
	Category string `json:"category"`
}

type UpdateEventRequest struct {
	Title             *string `json:"title"`
	Description       *string `json:"description"`
	Date              *string `json:"date"` // Format: "2006-01-02"
	Time              *string `json:"time"` // Format: "HH:MM"
	Location          *string `json:"location"`
	Email             *string `json:"email"`
	Phone             *string `json:"phone"`
	ReminderDay       *bool   `json:"reminder_day"`
	ReminderDayBefore *bool   `json:"reminder_day_before"`
	// Campos móviles
	IsAllDay *bool   `json:"is_all_day"`
	Color    *string `json:"color"`
	Priority *string `json:"priority"`
	Category *string `json:"category"`
}

// EventResponse es la respuesta optimizada para apps móviles
type EventResponse struct {
	ID                uint      `json:"id"`
	Title             string    `json:"title"`
	Description       string    `json:"description"`
	Date              string    `json:"date"` // Format: "2006-01-02"
	Time              string    `json:"time"`
	Location          string    `json:"location"`
	Email             string    `json:"email"`
	Phone             string    `json:"phone"`
	ReminderDay       bool      `json:"reminder_day"`
	ReminderDayBefore bool      `json:"reminder_day_before"`
	IsAllDay          bool      `json:"is_all_day"`
	Color             string    `json:"color"`
	Priority          string    `json:"priority"`
	Category          string    `json:"category"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// ToResponse convierte un Event a EventResponse
func (e *Event) ToResponse() EventResponse {
	return EventResponse{
		ID:                e.ID,
		Title:             e.Title,
		Description:       e.Description,
		Date:              e.Date.Format("2006-01-02"),
		Time:              e.Time,
		Location:          e.Location,
		Email:             e.Email,
		Phone:             e.Phone,
		ReminderDay:       e.ReminderDay,
		ReminderDayBefore: e.ReminderDayBefore,
		IsAllDay:          e.IsAllDay,
		Color:             e.Color,
		Priority:          e.Priority,
		Category:          e.Category,
		CreatedAt:         e.CreatedAt,
		UpdatedAt:         e.UpdatedAt,
	}
}
