package scraper

type SiteConfig struct {
	Name        string
	URL         string
	TitleSel    string
	LinkSel     string
	ImageSel    string
	DateSel     string
	RSSFallback string
}

var Sources = []SiteConfig{
	// Indonesia
	{
		Name:        "kompas",
			URL:         "https://www.kompas.com",
		RSSFallback: "", // TODO: verify
	},
	{
		Name:        "detik",
			URL:         "https://www.detik.com",
		RSSFallback: "", // TODO: verify
	},
	{
		Name:        "tempo",
			URL:         "https://www.tempo.co",
		RSSFallback: "", // TODO: verify
	},
	{
		Name:        "cnnindonesia",
			URL:         "https://www.cnnindonesia.com",
		RSSFallback: "", // TODO: verify
	},
	{
		Name:        "tribun",
			URL:         "https://www.tribunnews.com",
		RSSFallback: "", // TODO: verify
	},
	// Global
	{
		Name:        "reuters",
			URL:         "https://www.reuters.com",
		RSSFallback: "", // TODO: verify
	},
	{
		Name:        "apnews",
			URL:         "https://apnews.com",
		RSSFallback: "", // TODO: verify
	},
	{
		Name:        "bbc",
			URL:         "https://www.bbc.com/news",
		RSSFallback: "", // TODO: verify
	},
	{
		Name:        "bloomberg",
			URL:         "https://www.bloomberg.com",
		RSSFallback: "", // TODO: verify
	},
	{
		Name:        "aljazeera",
			URL:         "https://www.aljazeera.com",
		RSSFallback: "", // TODO: verify
	},
}
