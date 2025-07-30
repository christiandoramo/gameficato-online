// internal/handlers/checkin/service.go

package checkin

import (
	"fmt"
	"time"

	"github.com/christiandoramo/gameficato-online/internal/clients"
	"github.com/christiandoramo/gameficato-online/internal/config"
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
	db           *gorm.DB
	rewardClient *clients.RewardClient
}

func NewService(db *gorm.DB) *Service {
	baseURL := config.Load().CoreBackendUrl

	return &Service{db: db,
		rewardClient: clients.NewRewardClient(baseURL),
	}
}

func (s *Service) DoCheckIn(userID uuid.UUID) (CheckInResponse, error) {
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

	// transaction evita que crie nesse banco do GO e não crie no banco do NESTJS
	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 3.1) Sequência
		var seq models.Sequence
		err := tx.
			Where("user_id = ? AND ended_at IS NULL", userID).
			Order("started_at DESC").
			First(&seq).Error

		if err != nil || isSequenceExpired(tx, seq.ID, now) {
			if err == nil {
				tx.Model(&seq).Update("ended_at", &now)
			}
			seq = models.Sequence{ID: uuid.New(), UserID: userID, StartedAt: now}
			if err := tx.Create(&seq).Error; err != nil {
				return err
			}
		}

		// check-in
		chk := models.CheckIn{ID: uuid.New(), UserID: userID, SequenceID: seq.ID, CreatedAt: now}
		if err := tx.Create(&chk).Error; err != nil {
			return err
		}

		// contando
		var count int64
		if err := tx.Model(&models.CheckIn{}).
			Where("sequence_id = ?", seq.ID).
			Count(&count).Error; err != nil {
			return err
		}
		coins := baseCoins + int(count-1)*coinsStep

		rewardReq := clients.RewardRequest{Coins: coins, InGameCoins: coins, UserID: userID.String(), GameID: gameplayID}
		rewardResp, err := s.rewardClient.Create(rewardReq)
		if err != nil {
			return err
		}

		finalResp = CheckInResponse{
			Message:       fmt.Sprintf("Check-in realizado! Você ganhou %d moedas.", coins),
			CoinsReceived: coins,
			Status:        "receivedNow",
			Sequence:      int(count),
			Reward:        rewardResp,
		}
		return nil
	})

	if err != nil { // se não ocorreu corretamente, ou teve rollback
		return CheckInResponse{
			Message:       "Erro ao fazer check‑in: " + err.Error(),
			CoinsReceived: 0,
			Status:        "error",
			Sequence:      0,
		}, nil
	}

	// 5) Commit ocorreu, retorna finalResp
	return finalResp, nil
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
