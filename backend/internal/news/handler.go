package news

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"backend/internal/cache"
	"backend/pkg/response"
	"backend/pkg/types"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetQuota(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid, _ := userID.(string)

	count, _ := h.service.cache.GetQuota(uid)
	remaining := cache.QuotaLimit - count
	if remaining < 0 {
		remaining = 0
	}

	response.Success(c, http.StatusOK, gin.H{
		"used":      count,
		"remaining": remaining,
		"limit":     cache.QuotaLimit,
	})
}

func (h *Handler) GetHistory(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid, _ := userID.(string)

	entries, err := h.service.cache.GetHistory(uid)
	if err != nil {
		response.Success(c, http.StatusOK, gin.H{"history": []string{}})
		return
	}

	seen := make(map[string]bool)
	deduped := make([]string, 0, len(entries))
	for _, e := range entries {
		if !seen[e] {
			seen[e] = true
			deduped = append(deduped, e)
		}
	}

	response.Success(c, http.StatusOK, gin.H{"history": deduped})
}

func (h *Handler) Scrape(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid, _ := userID.(string)

	var query types.ScrapeQuery
	if err := c.ShouldBindJSON(&query); err != nil {
		response.Error(c, http.StatusBadRequest, "invalid request body")
		return
	}

	if query.Topic == "" {
		response.Error(c, http.StatusBadRequest, "topic is required")
		return
	}

	result, err := h.service.GetNews(uid, query)
	if err != nil {
		if errors.Is(err, ErrQuotaExceeded) {
			response.Error(c, http.StatusTooManyRequests, "daily quota exceeded")
			return
		}
		response.Error(c, http.StatusInternalServerError, "failed to fetch news")
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"count":     len(result.Items),
		"total":     result.Total,
		"news":      result.Items,
		"cache_hit": result.CacheHit,
	})
}
