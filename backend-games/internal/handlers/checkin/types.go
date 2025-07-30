// backend-games/internal/handlers/checkin/types.go
package checkin

import (
	"time"

	"github.com/christiandoramo/gameficato-online/internal/clients"
)

type CheckInResponse struct {
	Message       string                  `json:"message"`
	CoinsReceived int                     `json:"coinsReceived"`
	Status        string                  `json:"status"`
	Sequence      int                     `json:"sequence"`
	Reward        *clients.RewardResponse `json:"reward,omitempty"`
}

type CalendarDay struct {
	Coins    int       `json:"coins"`
	Day      time.Time `json:"day"`
	Received bool      `json:"received"`
}

type NextDay struct {
	Coins int       `json:"coins"`
	Day   time.Time `json:"day"`
}

type CalendarCheckIn struct {
	NextDayToReceive NextDay       `json:"nextDayToReceive"`
	CalendarDays     []CalendarDay `json:"calendarDays"`
}
