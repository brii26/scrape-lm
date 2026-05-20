package cache

import (
	"fmt"
	"time"
)

const sessionPrefix = "session:"

func (r *RedisClient) SaveSession(userID string, token string, ttl time.Duration) error {
	key := fmt.Sprintf("%s%s", sessionPrefix, userID)
	return r.Set(key, token, ttl)
}

func (r *RedisClient) DeleteSession(userID string) error {
	key := fmt.Sprintf("%s%s", sessionPrefix, userID)
	return r.Delete(key)
}
