package checkin

import "time"

type CheckInResponse struct {
	Message       string `json:"message"`
	CoinsReceived int    `json:"coinsReceived"`
	Status        string `json:"status"`   // "receivedNow", "waitToReceive", "error"
	Sequence      int    `json:"sequence"` // dias consecutivos
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
