package main

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName: "NexCore Gateway v1.0",
	})

	app.Use(cors.New())
	app.Use(logger.New())

	// Health Check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "UP",
			"time":   time.Now().Format(time.RFC3339),
			"services": []fiber.Map{
				{"name": "inventory-service", "status": "UP"},
				{"name": "order-service", "status": "UP"},
				{"name": "product-service", "status": "UP"},
			},
		})
	})

	// Proxy routes (Simulated)
	api := app.Group("/api/v1")

	api.Get("/stats", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"server_load": 24,
			"uptime":      "12h 45m",
			"active_users": 1540,
			"queue_status": "NORMAL",
		})
	})

	log.Println("Gateway running on :3000")
	log.Fatal(app.Listen(":3000"))
}
