package main

import (
	"log"
	"nexcore-flashsale/backend/shared"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	// Mock data
	products := []shared.Product{
		{
			ID:          "1",
			Name:        "NexCore Neural Link v2",
			Price:       1299.99,
			Stock:       100,
			Description: "Next-gen neural interface for high-speed data uplink.",
		},
		{
			ID:          "2",
			Name:        "Cyber HUD Glasses",
			Price:       499.00,
			Stock:       50,
			Description: "Augmented reality glasses with real-time system telemetry.",
		},
	}

	app.Get("/api/products", func(c *fiber.Ctx) error {
		return c.JSON(products)
	})

	app.Get("/api/products/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		for _, p := range products {
			if p.ID == id {
				return c.JSON(p)
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	})

	log.Println("Product Service running on :3002")
	log.Fatal(app.Listen(":3002"))
}
