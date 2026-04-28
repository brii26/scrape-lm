package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"backend/config"
)

func main() {
	cfg := config.Load()
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	log.Printf("server running on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
