package news

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"

	"backend/internal/cache"
	"backend/internal/scraper"
	"backend/pkg/hash"
	"backend/pkg/types"
)

const cacheTTL = 30 * time.Minute

var ErrQuotaExceeded = errors.New("quota exceeded")

type Service struct {
	cache *cache.RedisClient
}

func NewService(cache *cache.RedisClient) *Service {
	return &Service{cache: cache}
}

func (s *Service) GetNews(userID string, query types.ScrapeQuery) (scraper.PageResult, error) {
	count, err := s.cache.GetQuota(userID)
	if err != nil && err != redis.Nil {
		log.Printf("quota check error: %v", err)
	}
	if count >= cache.QuotaLimit {
		return scraper.PageResult{}, ErrQuotaExceeded
	}

	cacheKey := hash.CacheKey(query.Topic)

	cached, err := s.cache.Get(cacheKey)
	if err == nil {
		var all []types.NewsItem
		if jsonErr := json.Unmarshal([]byte(cached), &all); jsonErr == nil {
			log.Printf("cache hit: %s", cacheKey)
			result := scraper.Paginate(all, query.Filters)
			result.CacheHit = true
			if result.Total > 0 && query.Filters.Page == 1 {
				s.appendHistory(userID, query)
			}
			return result, nil
		}
	}

	if err != nil && err != redis.Nil {
		log.Printf("redis error: %v", err)
	}

	log.Printf("cache miss: %s - scraping", cacheKey)
	all := scraper.Scrape(query.Topic)

	data, jsonErr := json.Marshal(all)
	if jsonErr == nil {
		if setErr := s.cache.Set(cacheKey, string(data), cacheTTL); setErr != nil {
			log.Printf("redis set failed: %v", setErr)
		}
	}

	result := scraper.Paginate(all, query.Filters)
	if result.Total > 0 && query.Filters.Page == 1 {
		s.recordSuccess(userID, query)
	}
	return result, nil
}

func (s *Service) recordSuccess(userID string, query types.ScrapeQuery) {
	if err := s.cache.IncrQuota(userID); err != nil {
		log.Printf("quota incr failed: %v", err)
	}
	s.appendHistory(userID, query)
}

func (s *Service) appendHistory(userID string, query types.ScrapeQuery) {
	qBytes, err := json.Marshal(query)
	if err != nil {
		return
	}
	entry := fmt.Sprintf(`{"topic":%q,"q":%q}`, query.Topic, string(qBytes))
	if err := s.cache.AppendHistory(userID, entry); err != nil {
		log.Printf("history append failed: %v", err)
	}
}
