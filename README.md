# Robo-Advisor Order Splitter

## 🚀 Features

- **Portfolio-Based Order Splitting**: Automatically distribute investment amounts across multiple stocks based on portfolio weights
- **Market Hours Awareness**: Execution dates automatically adjust to next trading day if order is placed on weekend
- **Flexible Pricing**: Support for custom market prices or default pricing
- **Configurable Precision**: Adjustable decimal precision for share quantities
- **Performance Monitoring**: Request response times logged for all API calls
- **Type Safety**: Strict TypeScript with no `any` types
- **Comprehensive Testing**: Unit tests with Jest for core business logic
- **API Documentation**: Interactive Swagger documentation at `/api/docs`

## 🏗️ Architecture

The service follows **Domain-Driven Design** with clean separation of concerns:

```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Application bootstrap
├── config/
│   └── configuration.ts       # Application configuration
├── common/
│   ├── dto/                   # Shared DTOs
│   ├── enums/                 # Enums (OrderType)
│   ├── interfaces/            # Domain interfaces
│   ├── utils/                 # Utility functions (date, number)
│   └── interceptors/          # Performance interceptor
├── orders/
│   ├── orders.module.ts       # Orders module
│   ├── orders.controller.ts   # REST API endpoints
│   ├── orders.service.ts      # Order orchestration logic
│   ├── dto/                   # Request/response DTOs
│   └── entities/              # Order entity
├── pricing/
│   ├── pricing.module.ts      # Pricing module
│   └── pricing.service.ts     # Stock price resolution
├── portfolio/
│   ├── portfolio.module.ts    # Portfolio module
│   └── portfolio.service.ts   # Portfolio allocation logic
└── history/
    ├── history.module.ts      # History module
    └── history.service.ts     # In-memory order storage
```

### Key Design Principles

- **Single Responsibility**: Each service handles one domain concern
- **Dependency Injection**: All dependencies are injected via constructor
- **Open/Closed**: Easy to extend with new features (e.g., database persistence)
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Strict mode enabled
- **Jest** - Unit and integration testing
- **Swagger** - API documentation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🔧 Installation

```bash
# Install dependencies
npm install
```

## ⚙️ Configuration

Create a `.env` file in the root directory (optional):

```env
PORT=3000
SHARE_DECIMAL_PRECISION=4
DEFAULT_STOCK_PRICE=100
```

**Configuration Options:**

- `PORT`: Server port (default: 3000)
- `SHARE_DECIMAL_PRECISION`: Decimal places for share quantities (default: 4)
- `DEFAULT_STOCK_PRICE`: Default price when market price not provided (default: ₹100)

## 🚀 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The server will start at `http://localhost:3000`

**Swagger Documentation**: `http://localhost:3000/api/docs`

## 🧪 Testing

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📡 API Reference

### POST /api/orders/split

Creates and splits an order across the model portfolio.

**Request Body:**

```json
{
  "modelPortfolio": [
    { "symbol": "AAPL", "weight": 0.5 },
    { "symbol": "GOOGL", "weight": 0.3 },
    { "symbol": "MSFT", "weight": 0.2 }
  ],
  "totalAmount": 10000,
  "orderType": "BUY",
  "marketPrices": [
    { "symbol": "AAPL", "price": 150.25 },
    { "symbol": "GOOGL", "price": 2800.50 },
    { "symbol": "MSFT", "price": 310.75 }
  ]
}
```

**Response:**

```json
{
  "orderId": "a3b5c7d9-1234-5678-90ab-cdef12345678",
  "orderType": "BUY",
  "totalAmount": 10000,
  "executionDate": "2026-01-13T00:00:00.000Z",
  "stocks": [
    {
      "symbol": "AAPL",
      "amount": 5000,
      "quantity": 33.2779,
      "price": 150.25
    },
    {
      "symbol": "GOOGL",
      "amount": 3000,
      "quantity": 1.0712,
      "price": 2800.50
    },
    {
      "symbol": "MSFT",
      "amount": 2000,
      "quantity": 6.4359,
      "price": 310.75
    }
  ],
  "createdAt": "2026-01-11T10:30:00.000Z"
}
```

**Validation Rules:**

- Portfolio weights must sum to 1.0 (±0.001 tolerance)
- All weights must be non-negative
- Total amount must be > 0
- Order type must be either "BUY" or "SELL"
- Market prices (if provided) must be > 0

### GET /api/orders/history

Retrieves all previously created orders.

**Response:**

```json
[
  {
    "orderId": "a3b5c7d9-1234-5678-90ab-cdef12345678",
    "orderType": "BUY",
    "totalAmount": 10000,
    "executionDate": "2026-01-13T00:00:00.000Z",
    "stocks": [...],
    "createdAt": "2026-01-11T10:30:00.000Z"
  }
]
```

## 💡 Business Logic

### Order Splitting Algorithm

1. **Validation**: Verify portfolio weights sum to 1.0
2. **Price Resolution**: Use market prices if provided, otherwise default price
3. **Amount Allocation**: Calculate amount per stock: `totalAmount × weight`
4. **Share Calculation**: Calculate quantity: `amount ÷ price`, rounded to configured precision
5. **Execution Date**: Use next weekday if current day is weekend
6. **Persistence**: Store order in in-memory history

### Market Hours Logic

- **Trading Days**: Monday - Friday
- **Weekend Orders**: Automatically execute on next Monday
- **Time Zone**: Uses server local time

### Precision Handling

Share quantities are rounded using the configured precision (default: 4 decimal places):

```typescript
// Example: ₹5000 / ₹150.25 = 33.2779 shares (4 decimals)
```

## 📊 Performance

The `PerformanceInterceptor` logs response times for all requests:

```
[PerformanceInterceptor] POST /api/orders/split - 23ms
[PerformanceInterceptor] GET /api/orders/history - 5ms
```