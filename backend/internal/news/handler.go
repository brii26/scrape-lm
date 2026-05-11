package news

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"backend/pkg/response"
	"backend/pkg/types"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Scrape(c *gin.Context) {
	var query types.ScrapeQuery
	if err := c.ShouldBindJSON(&query); err != nil {
		response.Error(c, http.StatusBadRequest, "invalid request body")
		return
	}

	if query.Topic == "" {
		response.Error(c, http.StatusBadRequest, "topic is required")
		return
	}

	if len(query.Regions) == 0 {
		response.Error(c, http.StatusBadRequest, "at least one region is required")
		return
	}

	items, err := h.service.GetNews(query)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to fetch news")
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"count": len(items),
		"news":  items,
	})
}
