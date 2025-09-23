package services

import (
	"calendar-backend/models"
	"log"
	"time"

	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
)

type SchedulerService struct {
	db                  *gorm.DB
	notificationService *NotificationService
	cron                *cron.Cron
}

func NewSchedulerService(db *gorm.DB, notificationService *NotificationService) *SchedulerService {
	return &SchedulerService{
		db:                  db,
		notificationService: notificationService,
		cron:                cron.New(cron.WithLocation(time.UTC)),
	}
}

// Start starts the scheduler service
func (s *SchedulerService) Start() {
	log.Println("Starting scheduler service...")

	// Schedule daily check for reminders at 9:00 AM UTC
	s.cron.AddFunc("0 9 * * *", s.checkDayBeforeReminders)

	// Schedule hourly check for same-day reminders
	s.cron.AddFunc("0 * * * *", s.checkSameDayReminders)

	s.cron.Start()
	log.Println("Scheduler service started")
}

// Stop stops the scheduler service
func (s *SchedulerService) Stop() {
	if s.cron != nil {
		s.cron.Stop()
		log.Println("Scheduler service stopped")
	}
}

// checkDayBeforeReminders checks for events that need day-before reminders
func (s *SchedulerService) checkDayBeforeReminders() {
	log.Println("Checking for day-before reminders...")

	tomorrow := time.Now().AddDate(0, 0, 1)
	var events []models.Event

	// Find events for tomorrow that have day-before reminders enabled
	if err := s.db.Where("DATE(date) = DATE(?) AND reminder_day_before = ?", tomorrow, true).Find(&events).Error; err != nil {
		log.Printf("Error fetching day-before reminders: %v", err)
		return
	}

	for _, event := range events {
		log.Printf("Sending day-before reminder for event: %s", event.Title)
		if err := s.notificationService.SendNotification(&event, "day_before"); err != nil {
			log.Printf("Error sending day-before reminder for event %d: %v", event.ID, err)
		}
	}

	log.Printf("Processed %d day-before reminders", len(events))
}

// checkSameDayReminders checks for events that need same-day reminders
func (s *SchedulerService) checkSameDayReminders() {
	log.Println("Checking for same-day reminders...")

	today := time.Now()
	var events []models.Event

	// Find events for today that have same-day reminders enabled
	if err := s.db.Where("DATE(date) = DATE(?) AND reminder_day = ?", today, true).Find(&events).Error; err != nil {
		log.Printf("Error fetching same-day reminders: %v", err)
		return
	}

	for _, event := range events {
		// Check if it's time to send the reminder (1 hour before the event)
		eventTime, err := time.Parse("15:04", event.Time)
		if err != nil {
			log.Printf("Error parsing time for event %d: %v", event.ID, err)
			continue
		}

		// Create a time object for today with the event time
		eventDateTime := time.Date(today.Year(), today.Month(), today.Day(), eventTime.Hour(), eventTime.Minute(), 0, 0, today.Location())

		// Send reminder 1 hour before the event
		reminderTime := eventDateTime.Add(-1 * time.Hour)
		now := time.Now()

		// Check if it's time to send the reminder (within the last hour)
		if now.After(reminderTime) && now.Before(eventDateTime) {
			log.Printf("Sending same-day reminder for event: %s", event.Title)
			if err := s.notificationService.SendNotification(&event, "same_day"); err != nil {
				log.Printf("Error sending same-day reminder for event %d: %v", event.ID, err)
			}
		}
	}
}
