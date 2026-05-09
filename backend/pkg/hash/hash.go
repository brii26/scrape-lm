package hash

import (
	"crypto/sha256"
	"fmt"
	"sort"
	"strings"
)

func CacheKey(topic string, regions []string) string {
	sorted := make([]string, len(regions))
	copy(sorted, regions)
	sort.Strings(sorted)

	raw := topic + ":" + strings.Join(sorted, ",")
	sum := sha256.Sum256([]byte(raw))
	return fmt.Sprintf("%x", sum)
}
