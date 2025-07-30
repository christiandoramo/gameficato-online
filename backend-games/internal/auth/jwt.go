// futuramente terá a prórpia autenticação, mas vou usar junto com a de mercato online por enquanto

package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type ClaimsPayload struct {
	ID      string `json:"id"`
	Version int    `json:"version"`
	jwt.RegisteredClaims
}

func GenerateToken(userID, secret string, version int) (string, error) {
	now := time.Now().UTC()
	claims := ClaimsPayload{
		ID:      userID,
		Version: version,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(time.Hour * 24 * 365)), // longo prazo
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
