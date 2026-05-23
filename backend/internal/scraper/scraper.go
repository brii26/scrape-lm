package scraper

import (
	"crypto/sha256"
	"fmt"
	"log"
	"sort"
	"strings"
	"sync"
	"time"

	"backend/pkg/types"
)

const (
	maxFetch   = 30
	maxResults = 20
	perPage    = 6
)

// Scrape fetches and enriches news for the given topic, returning all results
// without pagination. Pagination is applied by the service layer after cache retrieval.
func Scrape(topic string) []types.NewsItem {
	items, err := fetchRSS(topic)
	if err != nil {
		log.Printf("rss fetch failed: %v", err)
		return nil
	}

	cutoff := time.Now().AddDate(0, 0, -7)
	var recent []rssItem
	for _, item := range items {
		t := parsePubDate(item.PubDate)
		if !t.IsZero() && t.After(cutoff) {
			recent = append(recent, item)
		}
	}

	if len(recent) > maxFetch {
		recent = recent[:maxFetch]
	}

	var (
		mu      sync.Mutex
		results []types.NewsItem
		wg      sync.WaitGroup
		sem     = make(chan struct{}, 5)
	)

	for i := range recent {
		wg.Add(1)
		go func(item rssItem) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			encodedURL := item.Link
			if encodedURL == "" {
				encodedURL = item.GUID
			}

			actualURL, err := decodeGoogleNewsURL(encodedURL)
			if err != nil {
				log.Printf("decode failed for %q: %v", item.Title, err)
				actualURL = encodedURL
			}

			summary, imageURL := fetchOGTags(actualURL)

			mu.Lock()
			results = append(results, types.NewsItem{
				ID:          hashStr(actualURL),
				Title:       cleanTitle(item.Title, item.Source),
				URL:         actualURL,
				Source:      item.Source,
				PublishedAt: item.PubDate,
				Summary:     summary,
				ImageURL:    imageURL,
			})
			mu.Unlock()
		}(recent[i])
	}

	wg.Wait()

	sort.Slice(results, func(i, j int) bool {
		ti := parsePubDate(results[i].PublishedAt)
		tj := parsePubDate(results[j].PublishedAt)
		return ti.After(tj)
	})

	if len(results) > maxResults {
		results = results[:maxResults]
	}

	return results
}

type PageResult struct {
	Items    []types.NewsItem
	Total    int
	CacheHit bool
}

func Paginate(items []types.NewsItem, filters types.Filters) PageResult {
	filtered := applyFilters(items, filters)

	if filters.Sort == "relevant" {
		sort.SliceStable(filtered, func(i, j int) bool {
			ti := parsePubDate(filtered[i].PublishedAt)
			tj := parsePubDate(filtered[j].PublishedAt)
			return ti.After(tj)
		})
	}

	total := len(filtered)

	page := filters.Page
	if page < 1 {
		page = 1
	}
	start := (page - 1) * perPage
	if start >= total {
		return PageResult{Items: []types.NewsItem{}, Total: total}
	}
	end := start + perPage
	if end > total {
		end = total
	}
	return PageResult{Items: filtered[start:end], Total: total}
}

func applyFilters(items []types.NewsItem, filters types.Filters) []types.NewsItem {
	var result []types.NewsItem
	for _, item := range items {
		text := strings.ToLower(item.Title + " " + item.Summary)
		if !matchesIncludes(text, filters.MustInclude) {
			continue
		}
		if matchesExcludes(text, filters.MustExclude) {
			continue
		}
		result = append(result, item)
	}
	return result
}

func matchesIncludes(text string, keywords []string) bool {
	for _, kw := range keywords {
		if !strings.Contains(text, strings.ToLower(kw)) {
			return false
		}
	}
	return true
}

func matchesExcludes(text string, keywords []string) bool {
	for _, kw := range keywords {
		if strings.Contains(text, strings.ToLower(kw)) {
			return true
		}
	}
	return false
}

func hashStr(s string) string {
	sum := sha256.Sum256([]byte(s))
	return fmt.Sprintf("%x", sum)[:16]
}
