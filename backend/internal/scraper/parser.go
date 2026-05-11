package scraper

import (
	"crypto/sha256"
	"fmt"
	"strings"

	"github.com/gocolly/colly/v2"
	"github.com/mmcdole/gofeed"

	"backend/pkg/types"
)

func parseRSSItem(item *gofeed.Item, region string, source string) types.NewsItem {
	url := strings.TrimSpace(item.Link)
	imageURL := ""
	if item.Image != nil {
		imageURL = item.Image.URL
	}

	return types.NewsItem{
		ID:          hashURL(url),
		Title:       strings.TrimSpace(item.Title),
		URL:         url,
		Source:      source,
		Region:      region,
		PublishedAt: item.Published,
		Summary:     strings.TrimSpace(item.Description),
		ImageURL:    imageURL,
	}
}

func parseHTMLElement(e *colly.HTMLElement, cfg SiteConfig) types.NewsItem {
	url := e.Request.AbsoluteURL(e.ChildAttr(cfg.LinkSel, "href"))

	return types.NewsItem{
		ID:          hashURL(url),
		Title:       strings.TrimSpace(e.ChildText(cfg.TitleSel)),
		URL:         url,
		Source:      cfg.Name,
		Region:      cfg.Region,
		PublishedAt: strings.TrimSpace(e.ChildText(cfg.DateSel)),
		Summary:     "",
		ImageURL:    e.ChildAttr(cfg.ImageSel, "src"),
	}
}

func hashURL(url string) string {
	sum := sha256.Sum256([]byte(url))
	return fmt.Sprintf("%x", sum)[:16]
}
