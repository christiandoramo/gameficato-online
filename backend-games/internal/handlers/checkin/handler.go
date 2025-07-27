package checkin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.Engine, gormDB *gorm.DB) {
	svc := NewService(gormDB)
	grp := r.Group("/gameplay/1")
	{
		grp.POST("", func(c *gin.Context) {
			// (mais tarde: extraia userID do JWT)
			userID := uuid.MustParse("00000000-0000-0000-0000-000000000000")
			msg, err := svc.DoCheckIn(userID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": msg})
		})
	}
}
