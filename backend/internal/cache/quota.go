package cache

import (
	"fmt"
	"time"
)

const (
	quotaPrefix = "quota:"
	QuotaLimit  = 10
	quotaTTL    = 24 * time.Hour
)

func (r *RedisClient) GetQuota(userID string) (int, error) {
	key := fmt.Sprintf("%s%s", quotaPrefix, userID)
	val, err := r.Client.Get(Ctx, key).Int()
	if err != nil {
		return 0, err
	}
	return val, nil
}

func (r *RedisClient) IncrQuota(userID string) error {
	key := fmt.Sprintf("%s%s", quotaPrefix, userID)
	pipe := r.Client.TxPipeline()
	pipe.Incr(Ctx, key)
	pipe.Expire(Ctx, key, quotaTTL)
	_, err := pipe.Exec(Ctx)
	return err
}
