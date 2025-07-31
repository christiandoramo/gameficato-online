// backend-games/internal/handlers/checkin/service.go
package checkin

import (
	"fmt"
	"time"

	"github.com/christiandoramo/gameficato-online/internal/clients"
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

type Service struct {
	db           *gorm.DB
	authClient   *clients.AuthClient
	rewardClient *clients.RewardClient
}

func NewService(db *gorm.DB, baseURL string) *Service {
	return &Service{
		db:           db,
		authClient:   clients.NewAuthClient(baseURL),
		rewardClient: clients.NewRewardClient(baseURL),
	}
}

func (s *Service) DoCheckIn(userIDStr, email, storeID string) (CheckInResponse, error) {
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return CheckInResponse{Message: "UUID inválido", Status: "error"}, fmt.Errorf("invalid UUID")
	}

	now := time.Now()
	start := now.Add(-interval)

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

	var finalResp CheckInResponse

	err = s.db.Transaction(func(tx *gorm.DB) error {
		if err := s.authClient.Login(email, "qualquer-senha", storeID); err != nil {
			return fmt.Errorf("login falhou: %w", err)
		}
		s.rewardClient.Token = s.authClient.Token

		// busca ou cria sequence
		var seq models.Sequence
		if err := tx.
			Where("user_id = ? AND ended_at IS NULL", userID).
			Order("started_at DESC").
			First(&seq).Error; err != nil || isSequenceExpired(tx, seq.ID, now) {

			if err == nil {
				tx.Model(&seq).Update("ended_at", &now)
			}
			seq = models.Sequence{ID: uuid.New(), UserID: userID, StartedAt: now}
			if err := tx.Create(&seq).Error; err != nil {
				return err
			}
		}

		// 3) cria check-in
		chk := models.CheckIn{ID: uuid.New(), UserID: userID, SequenceID: seq.ID, CreatedAt: now}
		if err := tx.Create(&chk).Error; err != nil {
			return err
		}

		// conta posição
		var count int64
		if err := tx.Model(&models.CheckIn{}).
			Where("sequence_id = ?", seq.ID).
			Count(&count).Error; err != nil {
			return err
		}
		coins := baseCoins + int(count-1)*coinsStep

		// cria reward
		rr, err := s.rewardClient.Create(clients.RewardRequest{
			Coins:       coins,
			InGameCoins: coins,
			UserID:      userID.String(),
			GameID:      gameplayID,
		})
		if err != nil {
			return fmt.Errorf("falha ao criar reward: %w", err)
		}

		// prepara resposta
		finalResp = CheckInResponse{
			Message:       fmt.Sprintf("Check-in realizado! Você ganhou %d moedas.", coins),
			CoinsReceived: coins,
			Status:        "receivedNow",
			Sequence:      int(count),
			Reward:        rr,
		}
		return nil
	})

	if err != nil {
		return CheckInResponse{
			Message:       err.Error(),
			CoinsReceived: 0,
			Status:        "error",
			Sequence:      0,
		}, nil
	}
	return finalResp, nil
}

func (s *Service) GetCalendar(userIDStr string) (CalendarCheckIn, error) {
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return CalendarCheckIn{}, fmt.Errorf("UUID inválido")
	}

	var seq models.Sequence
	if err := s.db.
		Where("user_id = ? AND ended_at IS NULL", userID).
		Order("started_at DESC").
		First(&seq).Error; err != nil {
		return CalendarCheckIn{}, fmt.Errorf("nenhuma sequência ativa encontrada")
	}
	if isSequenceExpired(s.db, seq.ID, time.Now()) {
		return CalendarCheckIn{}, fmt.Errorf("sequência expirada")
	}

	var checkins []models.CheckIn
	if err := s.db.
		Where("sequence_id = ?", seq.ID).
		Order("created_at ASC").
		Find(&checkins).Error; err != nil {
		return CalendarCheckIn{}, err
	}

	receivedMap := make(map[int64]bool)
	for _, c := range checkins {
		receivedMap[c.CreatedAt.Truncate(interval).Unix()] = true
	}

	days := make([]CalendarDay, 0, totalDays)
	var nextDay NextDay
	found := false
	for i := 0; i < totalDays; i++ {
		dayTime := seq.StartedAt.Truncate(interval).Add(time.Duration(i) * interval)
		received := receivedMap[dayTime.Unix()]
		days = append(days, CalendarDay{
			Coins:    baseCoins + i*coinsStep,
			Day:      dayTime,
			Received: received,
		})
		if !received && !found {
			nextDay = NextDay{Coins: days[i].Coins, Day: dayTime}
			found = true
		}
	}
	if !found {
		end := seq.StartedAt.Add(time.Duration(totalDays) * interval)
		nextDay = NextDay{Coins: baseCoins + totalDays*coinsStep, Day: end}
	}
	return CalendarCheckIn{NextDayToReceive: nextDay, CalendarDays: days}, nil
}

// helper
func isSequenceExpired(db *gorm.DB, sequenceID uuid.UUID, now time.Time) bool {
	var last models.CheckIn
	if err := db.
		Where("sequence_id = ?", sequenceID).
		Order("created_at DESC").
		First(&last).Error; err != nil {
		return true
	}
	return last.CreatedAt.Add(interval * 2).Before(now)
}
