package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// ClaimsPayload deve bater com o que o NestJS espera (id + version).
type ClaimsPayload struct {
	ID      string `json:"id"`
	Version int    `json:"version"`
	jwt.RegisteredClaims
}

// GenerateToken monta um JWT HS256 com secret chave e version.
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
