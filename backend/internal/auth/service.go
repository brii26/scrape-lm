package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"backend/internal/cache"
)

const sessionTTL = 24 * time.Hour

type Service struct {
	secret string
	redis  *cache.RedisClient
}

func NewService(secret string, redis *cache.RedisClient) *Service {
	return &Service{secret: secret, redis: redis}
}

type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func (s *Service) CreateSession(userID, email string) (string, error) {
	claims := Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(sessionTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(s.secret))
	if err != nil {
		return "", fmt.Errorf("sign token: %w", err)
	}

	if err := s.redis.SaveSession(userID, signed, sessionTTL); err != nil {
		return "", fmt.Errorf("save session: %w", err)
	}

	return signed, nil
}

func (s *Service) RevokeSession(userID string) error {
	return s.redis.DeleteSession(userID)
}
