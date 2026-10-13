# Cash Flow Backend

A RESTful personal finance management API built with Node.js, Express.js, and MongoDB. It enables users to securely manage income, expenses, categories, monthly budgets, and financial summaries.

## Features

- **Authentication:** User registration, login, JWT authentication, and bcrypt password hashing.
- **Transaction Management:** Create, retrieve, update, partially update, delete, and filter transactions.
- **Pagination:** Retrieve transaction records in manageable pages.
- **Category Management:** Organize transactions by category.
- **Financial Summaries:** Generate monthly, yearly, and category-wise expense summaries.
- **Budget Management:** Create and manage budgets and track spending against budget limits.
- **Dashboard Analytics:** Access financial summaries and spending insights.
- **Error Handling:** Centralized error-handling middleware.
- **Security:** Helmet security headers, CORS configuration, and rate limiting.
- **Database Performance:** MongoDB indexes for supported queries.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Helmet
- CORS
- express-rate-limit
- Postman

## Project Structure

```text
src/
├── config/
│   ├── db.js
│   └── env.js
├── controllers/
│   ├── authcontroller.js
│   ├── budgetcontroller.js
│   ├── categorycontroller.js
│   ├── dashboardcontroller.js
│   ├── summarycontroller.js
│   └── transactioncontroller.js
├── middlewares/
│   ├── authmiddleware.js
│   └── errormiddleware.js
├── models/
│   ├── budget.model.js
│   ├── category.model.js
│   ├── transaction.model.js
│   └── user.model.js
├── routes/
│   ├── authRoutes.js
│   ├── budgetroutes.js
│   ├── categoryroutes.js
│   ├── dashboardroutes.js
│   ├── summaryroutes.js
│   └── transactionroutes.js
├── app.js
└── server.js
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/vanshikarai055-creator/cash-flow-backend.git
cd cash-flow-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Use `.env.example` as a reference.

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:3000
```

Use the environment variable names expected by your application. Never commit real secrets or database credentials.

### 4. Start the server

Run in development mode:

```bash
npm run dev
```

The API should be available at `http://localhost:8000`.

## Authentication

Protected endpoints require a valid JWT.

Include the following HTTP header:

```http
Authorization: Bearer YOUR_TOKEN
```

Register or log in to obtain a token, then use it to access protected resources.

## API Endpoints

The following endpoints reflect the current documented API design. Verify each route against your route files before relying on this list.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |

### Transactions

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/transactions` | Create a transaction |
| GET | `/api/transactions` | List transactions with pagination |
| GET | `/api/transactions/:id` | Retrieve a transaction |
| GET | `/api/transactions/filter` | Filter transactions |
| PUT | `/api/transactions/:id` | Update a transaction |
| PATCH | `/api/transactions/:id` | Partially update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Categories

Category endpoints are available under `/api/categories` for supported category operations.

### Financial Summaries

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/summary` | Retrieve financial totals |
| GET | `/api/summary/monthly` | Monthly summary |
| GET | `/api/summary/yearly` | Yearly summary |
| GET | `/api/summary/category` | Category-wise expense summary |

### Budgets

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/budget` | Create a budget |
| GET | `/api/budget` | List budgets |
| GET | `/api/budget/status` | Retrieve budget status |
| PUT | `/api/budget/:id` | Update a budget |
| DELETE | `/api/budget/:id` | Delete a budget |

### Dashboard

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard` | Retrieve dashboard analytics |

Protected endpoints require authentication unless explicitly configured otherwise.

## Error Handling

The application uses centralized error-handling middleware to provide consistent error responses.

Example:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Security

Security measures include:

- JWT-based authentication.
- Password hashing with bcrypt.
- Helmet security headers.
- Configurable CORS.
- Global and authentication-specific rate limiting.
- Environment variables for sensitive configuration.
- User-scoped database queries for protected resources.

## Future Improvements

- Automated unit and integration testing.
- Structured logging with Winston or Pino.
- Docker containerization.
- CI/CD pipeline.
- Deployment to a cloud platform.
- Redis caching where appropriate.
- Frontend integration.
- Exportable financial reports.

## Author

**Vanshika**

GitHub: https://github.com/vanshikarai055-creator
