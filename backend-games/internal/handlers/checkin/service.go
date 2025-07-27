// internal/handlers/checkin/service.go

package checkin

import (
	"fmt"
	"time"

	"github.com/christiandoramo/gameficato-online/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	totalDays  = 30
	interval   = 30 * time.Second
	baseCoins  = 10
	coinsStep  = 1
	gameplayID = 1
)

// var (rewardsURL = fmt.Sprintf("%s/rewards", os.Getenv("CORE_BACKEND_URL")))

type Service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

//	go func() {
//		body := map[string]interface{}{
//			"coins":       coins,
//			"inGameCoins": coins,
//			"userId":      userID.String(),
//			"couponId":    nil,
//			"gameId":      gameplayID,
//		}
//		b, _ := json.Marshal(body)
//		http.Post(rewardsURL, "application/json", bytes.NewBuffer(b))
//	}()
func (s *Service) DoCheckIn(userID uuid.UUID) (CheckInResponse, error) {
	now := time.Now()
	start := now.Add(-interval)

	// Verifica se já fez check-in nesse intervalo
	var recent models.CheckIn
	if err := s.db.
		Where("user_id = ? AND created_at >= ?", userID, start).
		Order("created_at DESC").
		First(&recent).Error; err == nil {
		return CheckInResponse{
			Message:       "Você já fez check-in recentemente. Aguarde!",
			CoinsReceived: 0,
			Status:        "waitToReceive",
			Sequence:      0,
		}, nil
	}

	// Busca sequência ativa
	var seq models.Sequence
	err := s.db.
		Where("user_id = ? AND ended_at IS NULL", userID).
		Order("started_at DESC").
		First(&seq).Error

	// Verifica se deve criar nova sequência
	if err != nil || isSequenceExpired(s.db, seq.ID, now) {
		if err == nil {
			// Finaliza sequência antiga
			end := now
			s.db.Model(&seq).Update("ended_at", &end)
		}
		// Cria nova sequência
		seq = models.Sequence{
			ID:        uuid.New(),
			UserID:    userID,
			StartedAt: now,
		}
		if err := s.db.Create(&seq).Error; err != nil {
			return CheckInResponse{
				Message:       "Erro ao iniciar nova sequência.",
				CoinsReceived: 0,
				Status:        "error",
				Sequence:      0,
			}, err
		}
	}

	// Cria o check-in associado à sequência
	checkin := models.CheckIn{
		ID:         uuid.New(),
		UserID:     userID,
		SequenceID: seq.ID,
		CreatedAt:  now,
	}
	if err := s.db.Create(&checkin).Error; err != nil {
		return CheckInResponse{
			Message:       "Erro ao registrar check-in.",
			CoinsReceived: 0,
			Status:        "error",
			Sequence:      0,
		}, err
	}

	// Conta a posição na sequência
	var count int64
	s.db.Model(&models.CheckIn{}).
		Where("sequence_id = ?", seq.ID).
		Count(&count)

	coins := baseCoins + int(count-1)*coinsStep

	return CheckInResponse{
		Message:       fmt.Sprintf("Check-in realizado! Você ganhou %d moedas.", coins),
		CoinsReceived: coins,
		Status:        "receivedNow",
		Sequence:      int(count),
	}, nil
}

func (s *Service) GetCalendar(userID uuid.UUID) (CalendarCheckIn, error) {
	var seq models.Sequence

	err := s.db.
		Where("user_id = ? AND ended_at IS NULL", userID).
		Order("started_at DESC").
		First(&seq).Error

	if err != nil {
		return CalendarCheckIn{}, fmt.Errorf("nenhuma sequência ativa encontrada")
	}

	// Verifica se sequência ainda está válida
	if isSequenceExpired(s.db, seq.ID, time.Now()) {
		return CalendarCheckIn{}, fmt.Errorf("sequência expirada")
	}

	// Busca check-ins da sequência
	var checkins []models.CheckIn
	if err := s.db.
		Where("sequence_id = ?", seq.ID).
		Order("created_at ASC").
		Find(&checkins).Error; err != nil {
		return CalendarCheckIn{}, err
	}

	// Mapa de check-ins recebidos
	receivedMap := make(map[int64]bool)
	for _, c := range checkins {
		slot := c.CreatedAt.Truncate(interval).Unix()
		receivedMap[slot] = true
	}

	days := make([]CalendarDay, totalDays)
	var nextDay NextDay
	foundNext := false

	for i := 0; i < totalDays; i++ {
		dayTime := seq.StartedAt.Truncate(interval).Add(time.Duration(i) * interval)
		key := dayTime.Unix()
		received := receivedMap[key]

		days[i] = CalendarDay{
			Coins:    baseCoins + i*coinsStep,
			Day:      dayTime,
			Received: received,
		}

		if !received && !foundNext {
			nextDay = NextDay{Coins: days[i].Coins, Day: dayTime}
			foundNext = true
		}
	}

	if !foundNext {
		end := seq.StartedAt.Add(time.Duration(totalDays) * interval)
		nextDay = NextDay{Coins: baseCoins + totalDays*coinsStep, Day: end}
	}

	return CalendarCheckIn{
		NextDayToReceive: nextDay,
		CalendarDays:     days,
	}, nil
}

func isSequenceExpired(db *gorm.DB, sequenceID uuid.UUID, now time.Time) bool {
	var lastCheckIn models.CheckIn
	if err := db.
		Where("sequence_id = ?", sequenceID).
		Order("created_at DESC").
		First(&lastCheckIn).Error; err != nil {
		return true
	}
	return lastCheckIn.CreatedAt.Add(interval * 2).Before(now)

}
