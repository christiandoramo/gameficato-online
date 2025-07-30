package checkin

import (
	"net/http"

	"github.com/christiandoramo/gameficato-online/internal/config"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type checkInRequest struct {
	UserID  string `json:"userId" binding:"required,uuid"`
	Email   string `json:"email" binding:"required,email"`
	StoreID string `json:"storeId" binding:"required,uuid"`
}

func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	cfg := config.Load()
	svc := NewService(db, cfg.CoreBackendUrl)

	grp := r.Group("/gameplay/1")
	{
		grp.POST("", func(c *gin.Context) {
			var req checkInRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "Payload inválido (userId, email e storeId obrigatórios)",
					"status":  "error",
				})
				return
			}
			resp, err := svc.DoCheckIn(req.UserID, req.Email, req.StoreID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": resp.Message,
					"status":  "error",
				})
				return
			}
			c.JSON(http.StatusOK, resp)
		})

		grp.GET("/:userId/calendar", func(c *gin.Context) {
			resp, err := svc.GetCalendar(c.Param("userId"))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "Erro ao gerar calendário",
					"status":  "error",
				})
				return
			}
			c.JSON(http.StatusOK, resp)
		})
	}
}
