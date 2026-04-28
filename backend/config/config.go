package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port      string
	RedisAddr string
	JWTSecret string
	AppEnv    string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file, reading from system env")
	}

	cfg := &Config{
		Port:      getEnv("PORT", "8080"),
		RedisAddr: getEnv("REDIS_ADDR", "localhost:6379"),
		JWTSecret: getEnv("JWT_SECRET", ""),
		AppEnv:    getEnv("APP_ENV", "development"),
	}

	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET not set")
	}
	return cfg
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
