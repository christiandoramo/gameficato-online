package checkin

import (
	"time"

	"github.com/christiandoramo/gameficato-online/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

func (s *Service) DoCheckIn(userID uuid.UUID) (string, error) {
	today := time.Now().Truncate(24 * time.Hour)

	checkin := models.CheckIn{
		UserID:      userID,
		CheckInDate: today,
	}

	if err := s.db.Create(&checkin).Error; err != nil {
		// violação de unique constraint → já fez hoje
		if s.db.Error != nil && err.Error() == `ERROR: duplicate key value violates unique constraint "idx_user_date"` {
			return "Você já fez check‑in hoje!", nil
		}
		return "", err
	}

	return "Check‑in realizado! Você ganhou X moedas.", nil
}
