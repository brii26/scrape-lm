package news

import "github.com/gin-gonic/gin"

func RegisterRoutes(rg *gin.RouterGroup, handler *Handler) {
	rg.POST("/scrape", handler.Scrape)
	rg.GET("/history", handler.GetHistory)
	rg.GET("/quota", handler.GetQuota)
}
