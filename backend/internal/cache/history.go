package cache

import (
	"fmt"
)

const (
	historyPrefix = "history:"
	historyMaxLen = 20
)

func (r *RedisClient) AppendHistory(userID string, entry string) error {
	key := fmt.Sprintf("%s%s", historyPrefix, userID)
	pipe := r.Client.TxPipeline()
	pipe.LPush(Ctx, key, entry)
	pipe.LTrim(Ctx, key, 0, historyMaxLen-1)
	pipe.ExpireNX(Ctx, key, untilMidnightUTC())
	_, err := pipe.Exec(Ctx)
	return err
}

func (r *RedisClient) GetHistory(userID string) ([]string, error) {
	key := fmt.Sprintf("%s%s", historyPrefix, userID)
	return r.Client.LRange(Ctx, key, 0, historyMaxLen-1).Result()
}
