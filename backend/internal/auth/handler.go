package auth

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	googleapi "google.golang.org/api/oauth2/v2"
	"google.golang.org/api/option"

	"backend/pkg/response"
)

type Handler struct {
	service     *Service
	oauthConfig *oauth2.Config
}

func NewHandler(service *Service, clientID, clientSecret, redirectURL string) *Handler {
	cfg := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Scopes:       []string{"openid", "email", "profile"},
		Endpoint:     google.Endpoint,
	}
	return &Handler{service: service, oauthConfig: cfg}
}

func (h *Handler) GoogleLogin(c *gin.Context) {
	url := h.oauthConfig.AuthCodeURL("state", oauth2.AccessTypeOnline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *Handler) GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		response.Error(c, http.StatusBadRequest, "missing code")
		return
	}

	tok, err := h.oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "failed to exchange code")
		return
	}

	httpClient := h.oauthConfig.Client(context.Background(), tok)
	svc, err := googleapi.NewService(context.Background(), option.WithHTTPClient(httpClient))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to create google client")
		return
	}

	info, err := svc.Userinfo.Get().Do()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to get user info")
		return
	}

	jwt, err := h.service.CreateSession(info.Id, info.Email)
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
