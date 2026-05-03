package main

import (
	"encoding/json"
	"fmt"
	"log"
	"nexcore-flashsale/backend/shared"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

func main() {
	fmt.Println("Order Service Consumer starting...")

	// 1. Dial RabbitMQ (Simulated for local logic)
	// conn, _ := amqp091_go.Dial("amqp://guest:guest@localhost:5672/")
	// defer conn.Close()
	// ch, _ := conn.Channel()
	// defer ch.Close()

	// 2. Consume from Queue
	// msgs, _ := ch.Consume("order_queue", "", true, false, false, false, nil)

	fmt.Println("[*] Waiting for messages. To exit press CTRL+C")

	// Simulated consumption loop
	ticker := time.NewTicker(5 * time.Second)
	for range ticker.C {
		mockOrder := shared.StockUpdate{
			ProductID: "1",
			UserID:    fmt.Sprintf("user_%d", time.Now().Unix()),
			Quantity:  1,
		}

		data, _ := json.Marshal(mockOrder)
		log.Printf("[ORDER_PROCESSOR] Received message: %s", string(data))
		log.Printf("[DB] Persisting order to PostgreSQL...")
		log.Printf("[SUCCESS] Order saved for User: %s", mockOrder.UserID)
	}
}
