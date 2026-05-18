package auth

import "github.com/gin-gonic/gin"

func RegisterRoutes(public *gin.RouterGroup, protected *gin.RouterGroup, h *Handler) {
	public.POST("/auth/callback/google", h.GoogleCallback)
	protected.POST("/auth/logout", h.Logout)
}
