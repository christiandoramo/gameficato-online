package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/christiandoramo/gameficato-online/internal/models"
)

func ConnectAndMigrate() (*gorm.DB, error) {
	// DSN via env vars
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASS"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Ativa extensão uuid-ossp (necessário para uuid_generate_v4)
	if err := db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`).Error; err != nil {
		return nil, err
	}

	// Auto‑migrate dos modelos: cria/atualiza tabelas sem SQL manual
	if err := db.AutoMigrate(&models.CheckIn{}, &models.Sequence{}); err != nil {
		return nil, err
	}

	log.Println("✅ Banco migrado com GORM!")
	return db, nil
}
