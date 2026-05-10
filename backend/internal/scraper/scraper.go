package scraper

import (
	"log"
	"strings"
	"sync"

	"github.com/gocolly/colly/v2"
	"github.com/mmcdole/gofeed"

	"backend/internal/news"
)

const maxResults = 30

func Scrape(query news.ScrapeQuery) []news.NewsItem {
	var (
		mu      sync.Mutex
		results []news.NewsItem
	)

	var wg sync.WaitGroup

	for _, region := range query.Regions {
		sites, ok := Sources[region]
		if !ok {
			continue
		}

		for _, site := range sites {
			wg.Add(1)
			go func(s SiteConfig) {
				defer wg.Done()

				items := scrapeRSS(s)
				if len(items) == 0 {
					items = scrapeHTML(s)
				}

				filtered := applyFilters(items, query.Filters)

				mu.Lock()
				results = append(results, filtered...)
				mu.Unlock()
			}(site)
		}
	}

	wg.Wait()

	if len(results) > maxResults {
		results = results[:maxResults]
	}

	return results
}

func scrapeRSS(site SiteConfig) []news.NewsItem {
	if site.RSSFallback == "" {
		return nil
	}

	fp := gofeed.NewParser()
	feed, err := fp.ParseURL(site.RSSFallback)
	if err != nil {
		log.Printf("rss failed for %s: %v", site.Name, err)
		return nil
	}

	var items []news.NewsItem
	for _, item := range feed.Items {
		items = append(items, parseRSSItem(item, site.Region, site.Name))
	}
	return items
}

func scrapeHTML(site SiteConfig) []news.NewsItem {
	if site.TitleSel == "" {
		return nil
	}

	var items []news.NewsItem
	c := colly.NewCollector()

	if err := applyLimiter(c); err != nil {
		log.Printf("limiter failed for %s: %v", site.Name, err)
		return nil
	}

	c.OnHTML(site.TitleSel, func(e *colly.HTMLElement) {
		items = append(items, parseHTMLElement(e, site))
	})

	c.OnError(func(r *colly.Response, err error) {
		log.Printf("html scrape failed for %s: %v", site.Name, err)
	})

	c.Visit(site.URL)
	return items
}

func applyFilters(items []news.NewsItem, filters news.Filters) []news.NewsItem {
	var result []news.NewsItem

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
