# Cash Flow Backend

A RESTful personal finance management API built with **Node.js, Express.js, and MongoDB**. Cash Flow enables users to manage income, expenses, categories, monthly budgets, and financial summaries through authenticated API endpoints.

## Features

- **Authentication:** User registration and login using JWT authentication and bcrypt password hashing.
- **Transaction Management:** Create, retrieve, update, partially update, delete, and filter transactions.
- **Pagination:** Retrieve transaction records in manageable pages.
- **Category Management:** Organize transactions by category.
- **Financial Summaries:** Generate overall, monthly, yearly, and category-wise expense summaries.
- **Budget Management:** Create and manage monthly budgets and track spending against budget limits.
- **Spending Insights:** Compare category-wise spending with the previous month and identify spending trends.
- **Dashboard Analytics:** Retrieve financial summaries and dashboard information.
- **Error Handling:** Centralized error-handling middleware.
- **Security:** Helmet security headers, configurable CORS, rate limiting, and user-scoped database queries.
- **Database Performance:** MongoDB indexes for supported queries.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt / bcryptjs
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

## Installation and Setup

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

Create a `.env` file in the project root. Use `.env.example` as a reference if it exists.

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:3000
```

Use the exact environment variable names required by your application. Add any other required variables documented in your configuration. Never commit real secrets or database credentials.

### 4. Start the server

```bash
npm run dev
```

The API should be available at:

`http://localhost:8000`

The root endpoint can be used to check whether the API is running, if configured in the application.

## Authentication

Protected endpoints require a valid JWT.

Include the token in the HTTP request header:

```http
Authorization: Bearer YOUR_TOKEN
```

Register or log in to obtain a token, then use it to access protected resources. Never publish real authentication tokens.

## API Endpoints

Base URL: `http://localhost:8000`

The endpoint list below is based on the project's documented route design. Verify exact paths, query parameters, and authentication requirements against the current route files.

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

Category operations are available under `/api/categories`. Check the category routes for the supported create, retrieve, update, and delete operations.

### Financial Summaries

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/summary` | Retrieve overall financial totals |
| GET | `/api/summary/monthly` | Retrieve a monthly summary |
| GET | `/api/summary/yearly` | Retrieve a yearly summary |
| GET | `/api/summary/category` | Retrieve category-wise expense totals |
| GET | `/api/summary/insights` | Compare current- and previous-month spending |

Monthly summary and spending insights accept `month` and `year` query parameters, for example:

`/api/summary/insights?month=10&year=2026`

### Budgets

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/budget` | Create a budget |
| GET | `/api/budget` | List budgets |
| GET | `/api/budget/status` | Retrieve spending and budget status |
| PUT | `/api/budget/:id` | Update a budget |
| DELETE | `/api/budget/:id` | Delete a budget |

### Dashboard

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard` | Retrieve dashboard analytics |

Protected endpoints require authentication unless explicitly configured otherwise.

## Error Handling

The application uses centralized error-handling middleware for consistent error responses.

Example response:

```json
{
  "success": false,
  "message": "Error message"
}
```

HTTP status codes depend on the type of request and error.

## Security

- JWT-based authentication.
- Password hashing with bcrypt.
- Helmet security headers.
- Configurable CORS.
- Rate limiting.
- Environment variables for sensitive configuration.
- User-scoped queries for protected resources.

## Future Improvements

- Automated unit and integration tests.
- Structured logging with Winston or Pino.
- Docker containerization.
- CI/CD pipeline.
- Cloud deployment.
- Redis caching where appropriate.
- Frontend integration.
- Exportable financial reports.

## Author

**Vanshika**

GitHub: [vanshikarai055-creator](https://github.com/vanshikarai055-creator)
