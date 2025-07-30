// backend-games/internal/handlers/checkin/handler.go
package checkin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// payload para bind do JSON
type checkInRequest struct {
	UserID string `json:"userId" binding:"required,uuid"`
}

func RegisterRoutes(r *gin.Engine, gormDB *gorm.DB) {
	svc := NewService(gormDB)
	grp := r.Group("/gameplay/1")
	{
		// agora sem parâmetro na URL
		grp.POST("", handleDoCheckIn(svc))
		grp.GET("/:userId/calendar", handleGetCalendar(svc))
	}
}

func handleDoCheckIn(svc *Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req checkInRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Payload inválido (userId obrigatório, tipo UUID)",
				"status":  "error",
			})
			return
		}

		userID, err := uuid.Parse(req.UserID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "UUID inválido",
				"status":  "error",
			})
			return
		}

		resp, err := svc.DoCheckIn(userID)
		if err != nil && resp.Status == "error" {
			c.JSON(http.StatusInternalServerError, resp)
			return
		}

		c.JSON(http.StatusOK, resp)
	}
}

func handleGetCalendar(svc *Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := uuid.Parse(c.Param("userId"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "UUID inválido", "status": "error"})
			return
		}
		cal, err := svc.GetCalendar(userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao gerar calendário"})
			return
		}
		c.JSON(http.StatusOK, cal)
	}
}
