package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"backend/config"
	"backend/internal/auth"
	"backend/internal/cache"
	"backend/internal/middleware"
	"backend/internal/news"
)

func main() {
	cfg := config.Load()

	// redis
	redisClient := cache.NewRedis(cfg.RedisAddr)

	// auth
	authService := auth.NewService(cfg.JWTSecret, redisClient)
	authHandler := auth.NewHandler(authService, cfg.GoogleClientID, cfg.GoogleClientSecret, cfg.GoogleRedirectURL)

	// news
	newsService := news.NewService(redisClient)
	newsHandler := news.NewHandler(newsService)

	r := gin.New()

	// middleware
	r.Use(middleware.Logger())
	r.Use(middleware.CORS(cfg.AllowedOrigin))
	r.Use(middleware.RateLimit())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// debug only — remove before deploy
	r.POST("/debug/scrape", newsHandler.Scrape)

	// routes
	public := r.Group("")
	protected := r.Group("/api")
	protected.Use(middleware.Auth(cfg.JWTSecret))

	auth.RegisterRoutes(public, protected, authHandler)
	news.RegisterRoutes(protected, newsHandler)

	log.Printf("server running on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
