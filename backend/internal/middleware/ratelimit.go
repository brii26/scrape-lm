package middleware

import (
	"net/http"
	"sync"

	"golang.org/x/time/rate"

	"github.com/gin-gonic/gin"

	"backend/pkg/response"
)

type ipLimiter struct {
	limiter *rate.Limiter
}

var (
	mu       sync.Mutex
	limiters = make(map[string]*ipLimiter)
)

func getLimiter(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	if l, ok := limiters[ip]; ok {
		return l.limiter
	}

	l := &ipLimiter{limiter: rate.NewLimiter(10, 30)}
	limiters[ip] = l
	return l.limiter
}

func RateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		limiter := getLimiter(c.ClientIP())
		if !limiter.Allow() {
			response.Error(c, http.StatusTooManyRequests, "too many requests")
			c.Abort()
			return
		}
		c.Next()
	}
}
