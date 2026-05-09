package response

import (
	"github.com/gin-gonic/gin"
)

type envelope struct {
	Status  string `json:"status"`
	Data    any    `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
}

func Success(c *gin.Context, statusCode int, data any) {
	c.JSON(statusCode, envelope{
		Status: "success",
		Data:   data,
	})
}

func Error(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, envelope{
		Status:  "error",
		Message: message,
	})
}
