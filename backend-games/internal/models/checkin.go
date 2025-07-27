package models

import (
	"time"

	"github.com/google/uuid"
)

// CheckIn representa um registro de check‑in diário.
type CheckIn struct {
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID      uuid.UUID `gorm:"type:uuid;not null;index:idx_user_date,unique"`
	CheckInDate time.Time `gorm:"type:date;not null;index:idx_user_date,unique"`
	CreatedAt   time.Time
}
