package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"nexcore-flashsale/backend/shared"

	"github.com/gofiber/fiber/v2"
	"github.com/rabbitmq/amqp091-go"
	"github.com/redis/go-redis/v9"
)

var (
	ctx = context.Background()
	rdb *redis.Client
	mq  *amqp091_go.Channel
)

func main() {
	app := fiber.New()

	// Initialize Redis (Simulated for this demo)
	rdb = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	// Initialize RabbitMQ (Simulated)
	// conn, _ := amqp091_go.Dial("amqp://guest:guest@localhost:5672/")
	// mq, _ = conn.Channel()

	// Endpoint to check stock
	app.Get("/inventory/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		stock, err := rdb.Get(ctx, "stock:"+id).Int()
		if err == redis.Nil {
			return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
		}
		return c.JSON(fiber.Map{"product_id": id, "stock": stock})
	})

	// CRITICAL: Purchase Endpoint with Atomic Decrement
	app.Post("/purchase", func(c *fiber.Ctx) error {
		var req shared.StockUpdate
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}

		// 1. ATOMIC DECREMENT in Redis
		// This prevents multiple users from buying the same item if stock is 1
		result, err := rdb.Decr(ctx, "stock:"+req.ProductID).Result()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Internal server error"})
		}

		// 2. CHECK STOCK
		if result < 0 {
			// Rollback if stock went negative
			rdb.Incr(ctx, "stock:"+req.ProductID)
			return c.Status(400).JSON(fiber.Map{"error": "OUT OF STOCK", "status": "FAILED"})
		}

		// 3. SEND TO RABBITMQ (Asynchronous processing)
		// This ensures the user gets a response FAST while the DB handles the write
		log.Printf("[INVENTORY] User %s purchased %d of %s. Stock remaining: %d", req.UserID, req.Quantity, req.ProductID, result)
		
		msg, _ := json.Marshal(req)
		fmt.Printf("[MQ] Publishing order to queue: %s\n", string(msg))

		return c.JSON(fiber.Map{
			"status": "SUCCESS",
			"message": "Order placed in queue",
			"remaining_stock": result,
		})
	})

	log.Fatal(app.Listen(":3001"))
}
