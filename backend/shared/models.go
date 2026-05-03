package shared

import "time"

// Product represents the flash sale item
type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Description string  `json:"description"`
}

// Order represents a purchase request
type Order struct {
	ID        string    `json:"id"`
	ProductID string    `json:"product_id"`
	UserID    string    `json:"user_id"`
	Quantity  int       `json:"quantity"`
	Status    string    `json:"status"` // PENDING, SUCCESS, FAILED
	CreatedAt time.Time `json:"created_at"`
}

// StockUpdate message sent to RabbitMQ
type StockUpdate struct {
	ProductID string `json:"product_id"`
	UserID    string `json:"user_id"`
	Quantity  int    `json:"quantity"`
}
