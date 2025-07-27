// backend-games/cmd/server/main.go
package main

import (
	"github.com/christiandoramo/gameficato-online/internal/config"
	"github.com/christiandoramo/gameficato-online/internal/db"
	checkin "github.com/christiandoramo/gameficato-online/internal/handlers/checkin"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Carrega .env
	godotenv.Load()

	cfg := config.Load()

	// Conecta e faz AutoMigrate
	gormDB, err := db.ConnectAndMigrate()
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	// Registramos as rotas de check‑in, passando GORM como *gorm.DB
	checkin.RegisterRoutes(r, gormDB)

	r.Run(":" + cfg.Port)
}
