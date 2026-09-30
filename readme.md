# Cash Flow Backend

A RESTful backend API for managing personal finances, including income, expenses, categories, budgets, summaries, and dashboard analytics.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Income and expense management
- Transaction filtering
- Transaction pagination
- Transaction update and partial update
- Category management
- Monthly and yearly summaries
- Category-wise expense summary
- Budget management
- Budget status tracking
- Dashboard analytics
- Centralized error handling
- Request rate limiting
- CORS configuration
- Security headers with Helmet
- MongoDB indexing for improved query performance

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Helmet
- CORS
- express-rate-limit
- Postman

## Project Structure

src/
├── config/
│   ├── db.js
│   └── env.js
│
├── controllers/
│   ├── authcontroller.js
│   ├── budgetcontroller.js
│   ├── categorycontroller.js
│   ├── dashboardcontroller.js
│   ├── summarycontroller.js
│   └── transactioncontroller.js
│
├── middlewares/
│   ├── authmiddleware.js
│   └── errormiddleware.js
│
├── models/
│   ├── budget.model.js
│   ├── category.model.js
│   ├── transaction.model.js
│   └── user.model.js
│
├── routes/
│   ├── authRoutes.js
│   ├── budgetroutes.js
│   ├── categoryroutes.js
│   ├── dashboardroutes.js
│   ├── summaryroutes.js
│   └── transactionroutes.js
│
├── app.js
└── server.js

## Installation

Clone the repository:

git clone https://github.com/vanshikarai055-creator/cash-flow-backend.git

Go into the project:

cd cash-flow-backend

Install dependencies:

npm install

## Environment Variables

Create a `.env` file in the root directory.

Use `.env.example` as a reference.

Example:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

## Run the Server

Development mode:

npm run dev

The server runs on:

http://localhost:8000

## Authentication

Protected APIs require a JWT token.

Send the token using the Authorization header:

Authorization: Bearer YOUR_TOKEN

## API Modules

### Authentication

POST /api/auth/register

POST /api/auth/login

### Transactions

POST /api/transactions

GET /api/transactions

GET /api/transactions/:id

GET /api/transactions/filter

PUT /api/transactions/:id

PATCH /api/transactions/:id

DELETE /api/transactions/:id

### Categories

Category APIs are available under:

/api/categories

### Summary

GET /api/summary

GET /api/summary/monthly

GET /api/summary/yearly

GET /api/summary/category

### Budget

POST /api/budget

GET /api/budget

GET /api/budget/status

PUT /api/budget/:id

DELETE /api/budget/:id

### Dashboard

GET /api/dashboard

## Error Handling

The application uses centralized error handling middleware to provide consistent error responses.

Example:

{
    "success": false,
    "message": "Error message"
}

## Security

The backend includes:

- JWT authentication
- bcrypt password hashing
- Helmet security headers
- CORS configuration
- Global rate limiting
- Authentication-specific rate limiting
- Environment variables for sensitive configuration

## Future Improvements

- Automated testing
- API documentation with Swagger/OpenAPI
- Logging with Winston or Pino
- Docker support
- CI/CD pipeline
- Deployment
- Redis caching
- Frontend integration

## Author

Vanshika

GitHub:
https://github.com/vanshikarai055-creator