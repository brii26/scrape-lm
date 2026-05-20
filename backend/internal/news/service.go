package news

import (
	"encoding/json"
	"log"
	"time"

	"github.com/redis/go-redis/v9"

	"backend/internal/cache"
	"backend/internal/scraper"
	"backend/pkg/hash"
	"backend/pkg/types"
)

const cacheTTL = 30 * time.Minute

type Service struct {
	cache *cache.RedisClient
}

func NewService(cache *cache.RedisClient) *Service {
	return &Service{cache: cache}
}

func (s *Service) GetNews(query types.ScrapeQuery) ([]types.NewsItem, error) {
	cacheKey := hash.CacheKey(query.Topic)

	cached, err := s.cache.Get(cacheKey)
	if err == nil {
		var items []types.NewsItem
		if jsonErr := json.Unmarshal([]byte(cached), &items); jsonErr == nil {
			log.Printf("cache hit: %s", cacheKey)
			return items, nil
		}
	}

	if err != nil && err != redis.Nil {
		log.Printf("redis error: %v", err)
	}

	log.Printf("cache miss: %s — scraping", cacheKey)
	items := scraper.Scrape(query)

	data, jsonErr := json.Marshal(items)
	if jsonErr == nil {
		if setErr := s.cache.Set(cacheKey, string(data), cacheTTL); setErr != nil {
			log.Printf("redis set failed: %v", setErr)
		}
	}

	return items, nil
}
