package models

import (
	"time"

	"github.com/google/uuid"
)

type CheckIn struct {
	ID         uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID     uuid.UUID `gorm:"type:uuid;not null;index"`
	SequenceID uuid.UUID `gorm:"type:uuid;not null;index"`
	CreatedAt  time.Time
}

type Sequence struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index"`
	StartedAt time.Time `gorm:"not null"`
	EndedAt   *time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}
