package auth

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"

	"backend/pkg/response"
)

type Handler struct {
	service        *Service
	googleClientID string
}

func NewHandler(service *Service, clientID string) *Handler {
	return &Handler{service: service, googleClientID: clientID}
}

type googleCallbackRequest struct {
	IDToken string `json:"id_token" binding:"required"`
}

type githubCallbackRequest struct {
	ID    int64  `json:"id" binding:"required"`
	Email string `json:"email"`
}

func (h *Handler) GithubCallback(c *gin.Context) {
	var req githubCallbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "invalid request")
		return
	}

	sub := fmt.Sprintf("%d", req.ID)
	email := req.Email

	jwt, err := h.service.CreateSession(sub, email)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to create session")
		return
	}

	response.Success(c, http.StatusOK, gin.H{"token": jwt})
}

func (h *Handler) GoogleCallback(c *gin.Context) {
	var req googleCallbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "id_token required")
		return
	}

	payload, err := idtoken.Validate(context.Background(), req.IDToken, h.googleClientID)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "invalid id_token")
		return
	}

	sub := payload.Subject
	email, _ := payload.Claims["email"].(string)

	jwt, err := h.service.CreateSession(sub, email)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to create session")
		return
	}

	response.Success(c, http.StatusOK, gin.H{"token": jwt})
}

func (h *Handler) Logout(c *gin.Context) {
	userID, _ := c.Get("userID")
	if id, ok := userID.(string); ok {
		_ = h.service.RevokeSession(id)
	}
	response.Success(c, http.StatusOK, nil)
}
