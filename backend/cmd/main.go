package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"backend/config"
	"backend/internal/cache"
	"backend/internal/middleware"
	"backend/internal/news"
)

func main() {
	cfg := config.Load()

	redisClient := cache.NewRedis(cfg.RedisAddr)

	newsService := news.NewService(redisClient)
	newsHandler := news.NewHandler(newsService)

	r := gin.New()
	r.Use(middleware.Logger())
	r.Use(middleware.CORS(cfg.AllowedOrigin))
	r.Use(middleware.RateLimit())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api")
	api.Use(middleware.Auth(cfg.JWTSecret))
	{
		news.RegisterRoutes(api, newsHandler)
	}

	log.Printf("server running on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
