package services

import (
	"calendar-backend/config"
	"calendar-backend/models"
	"fmt"
	"log"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"github.com/twilio/twilio-go"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

type NotificationService struct {
	cfg *config.Config
}

func NewNotificationService() *NotificationService {
	return &NotificationService{
		cfg: config.LoadConfig(),
	}
}

// SendEmailNotification sends an email reminder for an event
func (s *NotificationService) SendEmailNotification(event *models.Event, reminderType string) error {
	if s.cfg.SendGridAPIKey == "" {
		log.Println("SendGrid API key not configured, skipping email notification")
		return nil
	}

	from := mail.NewEmail("Calendar Reminder", s.cfg.FromEmail)
	to := mail.NewEmail("User", event.Email)

	var subject string
	var body string

	switch reminderType {
	case "day_before":
		subject = fmt.Sprintf("Recordatorio: %s mañana", event.Title)
		body = fmt.Sprintf(`
			Hola!
			
			Te recordamos que mañana tenés:
			
			Evento: %s
			Fecha: %s
			Hora: %s
			%s
			
			¡No te lo pierdas!
		`, event.Title, event.Date.Format("02/01/2006"), event.Time,
			func() string {
				if event.Location != "" {
					return fmt.Sprintf("Ubicación: %s", event.Location)
				}
				return ""
			}())
	case "same_day":
		subject = fmt.Sprintf("Recordatorio: %s hoy", event.Title)
		body = fmt.Sprintf(`
			Hola!
			
			Te recordamos que hoy tenés:
			
			Evento: %s
			Hora: %s
			%s
			
			¡Que tengas un buen día!
		`, event.Title, event.Time,
			func() string {
				if event.Location != "" {
					return fmt.Sprintf("Ubicación: %s", event.Location)
				}
				return ""
			}())
	}

	message := mail.NewSingleEmail(from, subject, to, body, body)
	client := sendgrid.NewSendClient(s.cfg.SendGridAPIKey)

	response, err := client.Send(message)
	if err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}

	log.Printf("Email sent successfully to %s, status: %d", event.Email, response.StatusCode)
	return nil
}

// SendWhatsAppNotification sends a WhatsApp reminder for an event
func (s *NotificationService) SendWhatsAppNotification(event *models.Event, reminderType string) error {
	if s.cfg.TwilioAccountSID == "" || s.cfg.TwilioAuthToken == "" {
		log.Println("Twilio credentials not configured, skipping WhatsApp notification")
		return nil
	}

	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: s.cfg.TwilioAccountSID,
		Password: s.cfg.TwilioAuthToken,
	})

	var message string
	switch reminderType {
	case "day_before":
		message = fmt.Sprintf("Recordatorio: Mañana tienes '%s' a las %s", event.Title, event.Time)
	case "same_day":
		message = fmt.Sprintf("Recordatorio: Hoy tienes '%s' a las %s", event.Title, event.Time)
	}

	if event.Location != "" {
		message += fmt.Sprintf(" en %s", event.Location)
	}

	params := &twilioApi.CreateMessageParams{}
	params.SetTo(event.Phone)
	params.SetFrom(s.cfg.TwilioPhoneNumber)
	params.SetBody(message)

	_, err := client.Api.CreateMessage(params)
	if err != nil {
		return fmt.Errorf("failed to send WhatsApp message: %v", err)
	}

	log.Printf("WhatsApp message sent successfully to %s", event.Phone)
	return nil
}

// SendNotification sends both email and WhatsApp notifications
func (s *NotificationService) SendNotification(event *models.Event, reminderType string) error {
	// Send email notification
	if err := s.SendEmailNotification(event, reminderType); err != nil {
		log.Printf("Failed to send email notification: %v", err)
	}

	// Send WhatsApp notification
	if err := s.SendWhatsAppNotification(event, reminderType); err != nil {
		log.Printf("Failed to send WhatsApp notification: %v", err)
	}

	return nil
}
