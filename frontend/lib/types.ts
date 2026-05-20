export interface Filters {
  must_include: string[]
  must_exclude: string[]
  sort: "latest" | "relevant"
  page: number
}

export interface ScrapeQuery {
  topic: string
  filters: Filters
}

export interface NewsItem {
  id: string
  title: string
  url: string
  source: string
  published_at: string
  summary: string
  image_url: string
}

export interface NewsResponse {
  status: string
  data: {
    count: number
    total: number
    news: NewsItem[]
    cache_hit: boolean
  }
}
