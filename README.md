<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=30&duration=3000&pause=1000&color=00F2FF&center=true&vCenter=true&width=600&lines=NexCore+FlashSale+Engine;Microservices+Architecture;Real-Time+Inventory+Control;Built+with+Go+%2B+React" alt="Typing SVG" />

<br/>

![Go](https://img.shields.io/badge/Go-1.22-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.12-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

<br/>

> **A production-grade Flash Sale system built on a Microservices architecture to solve real-world Race Condition problems at scale — featuring a live Cyber HUD Admin Dashboard.**

<br/>

[🔴 Live Demo](#) · [📖 Documentation](#architecture) · [🐛 Report Bug](https://github.com/yourusername/nexcore-flashsale-engine/issues)

</div>

---

## 🧠 The Problem This Solves

In a standard Flash Sale, thousands of users click "Buy" simultaneously. A naive implementation leads to:

- ❌ **Overselling** — Stock goes negative because multiple threads read the same stock value at the same time.
- ❌ **Data Inconsistency** — Orders are created for items that no longer exist.
- ❌ **System Collapse** — A single monolithic server crumbles under the load.

This project solves all three using a **distributed microservices architecture**.

---

## ✅ The Solution

| Problem | Solution Used |
|---|---|
| Race Condition on stock | **Redis `DECRBY` Atomic Operation** (thread-safe, no lock needed) |
| Request overload | **RabbitMQ Message Queue** (order requests are queued, not processed simultaneously) |
| Single point of failure | **Microservices** (each service runs independently) |
| Slow inventory queries | **Redis Cache** (sub-millisecond reads) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│              React Dashboard │ Flash Sale Page               │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP / REST
                      ▼
┌─────────────────────────────────┐
│          API GATEWAY (Go)        │
│     Rate Limiting · Routing      │
└─────┬───────────┬───────────────┘
      │           │
      ▼           ▼
┌──────────┐  ┌──────────────┐    ┌─────────────────────────┐
│ Product  │  │  Inventory   │───▶│  Redis (Atomic Counter) │
│ Service  │  │  Service     │    │  DECRBY for Stock        │
│  (Go)    │  │  (Go)        │    └─────────────────────────┘
└──────────┘  └──────┬───────┘
                     │ Publish
                     ▼
            ┌─────────────────┐   ┌───────────────────────┐
            │   RabbitMQ      │──▶│   Order Service (Go)  │
            │  Message Queue  │   │   Consumes & Persists │
            └─────────────────┘   └───────────┬───────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │   PostgreSQL DB   │
                                    │  (Persistent)     │
                                    └──────────────────┘
```

---

## 🎛️ Admin Dashboard Preview

> **Cyber HUD Theme** with full Dark / Light Mode toggle — real-time system monitoring at a glance.

| Feature | Description |
|---|---|
| 📊 Live Stats | Stock, Orders, Queue length update every 4 seconds |
| 🟢 Service Health | Status indicator for Gateway, Order Processor, Inventory Sync |
| 🖥️ Security Logs | Live feed of system events with timestamps |
| 🎨 Dark / Light Mode | Smooth theme transition via CSS Variables |
| ⚡ Control Center | Trigger sessions, pause sales, flush cache |

---

## 🚀 Tech Stack

### Backend
| Layer | Technology | Purpose |
|---|---|---|
| Language | **Go (Golang)** | High-performance, concurrent microservices |
| Web Framework | **Fiber** | Express-like HTTP framework for Go |
| Message Broker | **RabbitMQ** | Async order queuing |
| Cache & Atomic Ops | **Redis** | Sub-ms stock reads, Race Condition prevention |
| Database | **PostgreSQL** | Persistent order & product storage |
| Containerization | **Docker + Compose** | One-command environment setup |

### Frontend
| Layer | Technology | Purpose |
|---|---|---|
| Framework | **React 18 + Vite 5** | Fast SPA with HMR |
| Styling | **Vanilla CSS** | Custom Cyber HUD design system |
| Icons | **Lucide React** | Consistent icon library |
| Fonts | **Orbitron + Rajdhani** | Futuristic HUD typography |

---

## 📦 Getting Started

### Prerequisites
- [Go 1.22+](https://go.dev/dl/)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/nexcore-flashsale-engine.git
cd nexcore-flashsale-engine
```

### 2. Start infrastructure (Redis, RabbitMQ, PostgreSQL)
```bash
docker-compose up -d
```

### 3. Start the Admin Dashboard (Frontend)
```bash
cd frontend
npm install
npm run dev
```
> Dashboard will be available at `http://localhost:5173`

### 4. Start the Microservices (Backend)
```bash
# In separate terminals:
cd backend/gateway && go run main.go
cd backend/product && go run main.go
cd backend/inventory && go run main.go
cd backend/order && go run main.go
```

---

## 📁 Project Structure

```
nexcore-flashsale-engine/
├── backend/
│   ├── gateway/        # API Gateway - routing & rate limiting
│   ├── product/        # Product & Flash Sale schedule management
│   ├── inventory/      # Stock management with Redis atomic ops
│   ├── order/          # Order processing via RabbitMQ consumer
│   └── shared/         # Shared models, config, utilities
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # Main Dashboard component
│   │   └── index.css   # Cyber HUD Design System
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🔬 Key Concepts Demonstrated

### 1. Solving Race Condition with Redis Atomic Operations
```go
// ❌ Unsafe (classic race condition)
stock := getStockFromDB()
if stock > 0 {
    updateStock(stock - 1)  // Another goroutine may do the same!
}

// ✅ Safe (atomic Redis operation)
remaining, err := rdb.Decr(ctx, "product:stock:1").Result()
if remaining < 0 {
    rdb.Incr(ctx, "product:stock:1") // Rollback
    return errors.New("out of stock")
}
```

### 2. Async Order Processing via RabbitMQ
```go
// Producer (Inventory Service) — publishes order to queue
ch.Publish("", "order_queue", false, false, amqp.Publishing{
    ContentType: "application/json",
    Body:        orderJSON,
})

// Consumer (Order Service) — processes orders from queue
msgs, _ := ch.Consume("order_queue", "", true, false, false, false, nil)
for msg := range msgs {
    processAndSaveOrder(msg.Body) // Saved to PostgreSQL
}
```

---

## 👨‍💻 Author

<div align="center">

**[Your Name]**

[![GitHub](https://img.shields.io/badge/GitHub-yourusername-181717?style=for-the-badge&logo=github)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-yourname-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/yourname)

*Informatics Student | Backend & Distributed Systems Enthusiast*

</div>

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

<div align="center">

---

*Built with ☕ and a lot of debugging sessions*

⭐ **Star this repo if you find it useful!**

</div>
