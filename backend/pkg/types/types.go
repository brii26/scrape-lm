package types

type ScrapeQuery struct {
	Topic   string   `json:"topic"`
	Regions []string `json:"region"`
	Filters Filters  `json:"filters"`
}

type Filters struct {
	MustInclude []string `json:"must_include"`
	MustExclude []string `json:"must_exclude"`
	Sort        string   `json:"sort"`
	Page        int      `json:"page"`
}

type NewsItem struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	URL         string `json:"url"`
	Source      string `json:"source"`
	Region      string `json:"region"`
	PublishedAt string `json:"published_at"`
	Summary     string `json:"summary"`
	ImageURL    string `json:"image_url"`
}
