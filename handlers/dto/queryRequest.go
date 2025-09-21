package dto

import (
	"errors"
	"time"

	"github.com/gin-gonic/gin"
)

// GetEventsQueryRequest DTO para los query parameters de GetEvents
type GetEventsQueryRequest struct {
	Date      string `form:"date" validate:"omitempty,date_format"`
	StartDate string `form:"start_date" validate:"omitempty,date_format"`
	EndDate   string `form:"end_date" validate:"omitempty,date_format"`
	Search    string `form:"search" validate:"omitempty,min=1,max=100"`
}

// ProcessQueryRequest procesa los query parameters
func (req *GetEventsQueryRequest) ProcessQueryRequest(c *gin.Context) error {
	// Binding de query parameters
	if err := c.ShouldBindQuery(req); err != nil {
		return err
	}

	// Validar fechas si se proporcionan
	if err := req.ValidateDates(); err != nil {
		return err
	}

	// Validar búsqueda
	if err := req.ValidateSearch(); err != nil {
		return err
	}

	return nil
}

// ValidateDates valida los formatos de fecha
func (req *GetEventsQueryRequest) ValidateDates() error {
	// Validar fecha individual
	if req.Date != "" {
		_, err := time.Parse("2006-01-02", req.Date)
		if err != nil {
			return errors.New("invalid date format, use YYYY-MM-DD")
		}
	}

	// Validar rango de fechas
	if req.StartDate != "" && req.EndDate != "" {
		start, err1 := time.Parse("2006-01-02", req.StartDate)
		end, err2 := time.Parse("2006-01-02", req.EndDate)
		
		if err1 != nil || err2 != nil {
			return errors.New("invalid date range format, use YYYY-MM-DD")
		}
		
		// Validar que startDate no sea mayor que endDate
		if start.After(end) {
			return errors.New("start_date cannot be after end_date")
		}
	} else if req.StartDate != "" || req.EndDate != "" {
		return errors.New("both start_date and end_date must be provided for date range")
	}

	return nil
}

// ValidateSearch valida el parámetro de búsqueda
func (req *GetEventsQueryRequest) ValidateSearch() error {
	if req.Search != "" {
		if len(req.Search) < 1 {
			return errors.New("search query must be at least 1 character")
		}
		if len(req.Search) > 100 {
			return errors.New("search query must be less than 100 characters")
		}
	}
	return nil
}

// GetQueryType determina qué tipo de consulta realizar
func (req *GetEventsQueryRequest) GetQueryType() string {
	if req.Search != "" {
		return "search"
	}
	if req.Date != "" {
		return "date"
	}
	if req.StartDate != "" && req.EndDate != "" {
		return "date_range"
	}
	return "all"
}

// GetSearchQuery retorna el término de búsqueda
func (req *GetEventsQueryRequest) GetSearchQuery() string {
	return req.Search
}

// GetDate retorna la fecha específica
func (req *GetEventsQueryRequest) GetDate() string {
	return req.Date
}

// GetDateRange retorna el rango de fechas
func (req *GetEventsQueryRequest) GetDateRange() (string, string) {
	return req.StartDate, req.EndDate
}
