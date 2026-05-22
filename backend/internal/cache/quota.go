package cache

import (
	"fmt"
	"time"
)

const (
	quotaPrefix = "quota:"
	QuotaLimit  = 10
)

func untilMidnightUTC() time.Duration {
	now := time.Now().UTC()
	midnight := time.Date(now.Year(), now.Month(), now.Day()+1, 0, 0, 0, 0, time.UTC)
	return time.Until(midnight)
}

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
	pipe.ExpireNX(Ctx, key, untilMidnightUTC())
	_, err := pipe.Exec(Ctx)
	return err
}
