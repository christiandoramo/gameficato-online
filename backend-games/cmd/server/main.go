// backend-games/cmd/server/main.go
package main

import (
	"time"

	"github.com/christiandoramo/gameficato-online/internal/config"
	"github.com/christiandoramo/gameficato-online/internal/db"
	checkin "github.com/christiandoramo/gameficato-online/internal/handlers/checkin"
	"github.com/gin-contrib/cors" // ← importa o CORS
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	cfg := config.Load()

	gormDB, err := db.ConnectAndMigrate()
	if err != nil {
		panic(err)
	}

	// cria o router
	r := gin.Default()

	// middleware de CORS: permite qualquer origem, todos os métodos e cabeçalhos
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// registra as rotas de check-in
	checkin.RegisterRoutes(r, gormDB)

	r.Run(":" + cfg.Port)
}
