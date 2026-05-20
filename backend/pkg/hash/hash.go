package hash

import (
	"crypto/sha256"
	"fmt"
)

func CacheKey(topic string) string {
	sum := sha256.Sum256([]byte(topic))
	return fmt.Sprintf("%x", sum)
}
