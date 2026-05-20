package scraper

import (
	"encoding/xml"
	"fmt"
	"html"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"
)

type rssItem struct {
	Title   string `xml:"title"`
	Link    string `xml:"link"`
	GUID    string `xml:"guid"`
	PubDate string `xml:"pubDate"`
	Source  string `xml:"source"`
}

type rssFeed struct {
	Items []rssItem `xml:"channel>item"`
}

var (
	ogDescRe1  = regexp.MustCompile(`(?i)<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']`)
	ogDescRe2  = regexp.MustCompile(`(?i)<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']`)
	metaDescRe = regexp.MustCompile(`(?i)<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']`)
	ogImgRe1   = regexp.MustCompile(`(?i)<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']`)
	ogImgRe2   = regexp.MustCompile(`(?i)<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']`)
)

func fetchRSS(topic string) ([]rssItem, error) {
	rssURL := fmt.Sprintf(
		"https://news.google.com/rss/search?q=%s&hl=en&gl=US&ceid=US:en",
		url.QueryEscape(topic),
	)

	client := newHTTPClient()
	req, _ := http.NewRequest("GET", rssURL, nil)
	setRequestHeaders(req)

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var feed rssFeed
	if err := xml.Unmarshal(body, &feed); err != nil {
		return nil, err
	}

	return feed.Items, nil
}

func fetchOGTags(articleURL string) (summary, imageURL string) {
	client := newHTTPClient()
	req, _ := http.NewRequest("GET", articleURL, nil)
	setRequestHeaders(req)

	resp, err := client.Do(req)
	if err != nil {
		return "", ""
	}
	defer resp.Body.Close()

	buf := make([]byte, 16384)
	n, _ := io.ReadFull(resp.Body, buf)
	head := string(buf[:n])

	if m := ogDescRe1.FindStringSubmatch(head); m != nil {
		summary = html.UnescapeString(m[1])
	} else if m := ogDescRe2.FindStringSubmatch(head); m != nil {
		summary = html.UnescapeString(m[1])
	} else if m := metaDescRe.FindStringSubmatch(head); m != nil {
		summary = html.UnescapeString(m[1])
	}

	if m := ogImgRe1.FindStringSubmatch(head); m != nil {
		imageURL = html.UnescapeString(m[1])
	} else if m := ogImgRe2.FindStringSubmatch(head); m != nil {
		imageURL = html.UnescapeString(m[1])
	}

	return summary, imageURL
}

func parsePubDate(s string) time.Time {
	formats := []string{time.RFC1123Z, time.RFC1123, "Mon, 02 Jan 2006 15:04:05 -0700"}
	for _, f := range formats {
		if t, err := time.Parse(f, strings.TrimSpace(s)); err == nil {
			return t
		}
	}
	return time.Time{}
}

func cleanTitle(title, source string) string {
	suffix := " - " + source
	if strings.HasSuffix(title, suffix) {
		return strings.TrimSuffix(title, suffix)
	}
	return title
}
