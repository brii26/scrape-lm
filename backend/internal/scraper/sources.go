package scraper

type SiteConfig struct {
	Name        string
	Region      string
	URL         string
	TitleSel    string
	LinkSel     string
	ImageSel    string
	DateSel     string
	RSSFallback string
}

var Sources = map[string][]SiteConfig{
	"id": {
		{
			Name:        "detik",
			Region:      "id",
			URL:         "https://www.detik.com/terpopuler",
			TitleSel:    "",
			LinkSel:     "",
			ImageSel:    "",
			DateSel:     "",
			RSSFallback: "https://rss.detik.com/index.php/detikcom",
		},
		{
			Name:        "kompas",
			Region:      "id",
			URL:         "https://www.kompas.com/terkini",
			TitleSel:    "",
			LinkSel:     "",
			ImageSel:    "",
			DateSel:     "",
			RSSFallback: "https://rss.kompas.com/index.php/kompascom",
		},
		{
			Name:        "tempo",
			Region:      "id",
			URL:         "https://www.tempo.co/terkini",
			TitleSel:    "",
			LinkSel:     "",
			ImageSel:    "",
			DateSel:     "",
			RSSFallback: "https://rss.tempo.co/",
		},
	},
	"us": {
		{
			Name:        "reuters",
			Region:      "us",
			URL:         "https://www.reuters.com/news/archive/",
			TitleSel:    "",
			LinkSel:     "",
			ImageSel:    "",
			DateSel:     "",
			RSSFallback: "https://feeds.reuters.com/reuters/topNews",
		},
		{
			Name:        "cnn",
			Region:      "us",
			URL:         "https://edition.cnn.com/us",
			TitleSel:    "",
			LinkSel:     "",
			ImageSel:    "",
			DateSel:     "",
			RSSFallback: "http://rss.cnn.com/rss/edition.rss",
		},
	},
	"uk": {
		{
			Name:        "bbc",
			Region:      "uk",
			URL:         "https://www.bbc.com/news",
			TitleSel:    "",
			LinkSel:     "",
			ImageSel:    "",
			DateSel:     "",
			RSSFallback: "http://feeds.bbci.co.uk/news/rss.xml",
		},
		{
			Name:        "guardian",
			Region:      "uk",
			URL:         "https://www.theguardian.com/international",
			TitleSel:    "",
			LinkSel:     "",
			ImageSel:    "",
			DateSel:     "",
			RSSFallback: "https://www.theguardian.com/world/rss",
		},
	},
	"gcc": {
		{
			Name:        "aljazeera",
			Region:      "gcc",
			URL:         "https://www.aljazeera.com/news/",
			TitleSel:    "",
			LinkSel:     "",
			ImageSel:    "",
			DateSel:     "",
			RSSFallback: "https://www.aljazeera.com/xml/rss/all.xml",
		},
		{
			Name:        "arabnews",
			Region:      "gcc",
			URL:         "https://www.arabnews.com/",
			TitleSel:    "",
			LinkSel:     "",
			ImageSel:    "",
			DateSel:     "",
			RSSFallback: "https://www.arabnews.com/rss.xml",
		},
	},
}
