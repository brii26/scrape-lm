package auth

import "github.com/gin-gonic/gin"

func RegisterRoutes(public *gin.RouterGroup, protected *gin.RouterGroup, h *Handler) {
	public.POST("/auth/callback/google", h.GoogleCallback)
	public.POST("/auth/callback/github", h.GithubCallback)
	protected.POST("/auth/logout", h.Logout)
}
