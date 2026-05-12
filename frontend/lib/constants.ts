export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export const PAGINATION = {
  TOTAL_PAGES: 5,
  PER_PAGE: 6,
  MAX_RESULTS: 30,
}

export const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export const MAX_DATE_RANGE_DAYS = 7
