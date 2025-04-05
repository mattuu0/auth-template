package structs

import "github.com/labstack/echo/v4"

type HttpResult struct {
	Code    int      `json:"code"`
	Message echo.Map `json:"message"`
	Error   error    `json:"error"`
	Success bool     `json:"success"`
}
