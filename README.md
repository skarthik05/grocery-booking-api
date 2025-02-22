# Grocery Booking API

## Description

The Grocery Booking API is a NestJS-based application designed to manage grocery bookings, user authentication, and order processing. It provides a RESTful API for managing groceries, users, and orders, with support for role-based access control and integration with Elasticsearch for advanced search capabilities.

## Features

- User authentication and authorization
- Role-based access control (Admin, Vendor, User)
- CRUD operations for groceries and orders
- Integration with Elasticsearch for grocery search
- Health check endpoint
- API documentation using Swagger

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5).
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Elasticsearch**: A distributed, RESTful search and analytics engine.
- **Swagger**: API documentation and testing tool.
- **Docker**: Containerization for easy deployment.
- **Docker Compose**: Multi-container orchestration tool.

## Installation

### Running with Docker Compose

1. Clone the repository:

   ```bash
   git clone https://github.com/skarthik05/grocery-booking-api.git
   cd grocery-booking-api
   ```

2. Create a `.env` file in the root directory and configure the necessary environment variables. You can refer to the `.env.example` file for guidance.

   **Example `.env` file:**
   ```env
   DATABASE_HOST="127.0.0.1"
   DATABASE_USER="postgres"
   DATABASE_PASSWORD="1234"
   DATABASE_NAME="grocery_booking_db"
   DATABASE_PORT=5432
   PORT=3000
   BCRYPT_SALT_ROUNDS=10
   JWT_SECRET="secret"
   JWT_EXPIRATION_TIME=1d
   ELASTICSEARCH_NODE='http://localhost:9200'
   REDIS_HOST='localhost'
   REDIS_PORT=6379
   REDIS_PASSWORD=''
   REDIS_EXPIRATION_TIME=10
   ELASTICSEARCH_INDEX=groceries
   ELASTICSEARCH_USERNAME="elastic"
   ELASTICSEARCH_PASSWORD=""
   ELASTICSEARCH_TYPE='single-node'
   NODE_ENV=local
   ```

3. Start the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

4. The API will be accessible at:
   - **Base URL**: `http://localhost:3000`
   - **Swagger Documentation**: `http://localhost:3000/api`

### Running without Docker

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the application:

   ```bash
   npm run start:dev
   ```

## API Documentation

The API is documented using Swagger. You can access the documentation by navigating to `http://localhost:3000/api` after starting the application.

### Endpoints

- **Health Check**
  - `GET /health`: Returns the status of the API.

- **User Endpoints**
  - `POST /auth/signup`: Create a new user.
  - `POST /auth/signin`: Sign in an existing user.
  - `POST /auth/signout`: Sign out the current user.

- **Grocery Endpoints**
  - `POST /groceries`: Create a new grocery item (Admin only).
  - `GET /groceries`: Retrieve a list of all groceries.
  - `GET /groceries/:id`: Retrieve a specific grocery item by ID.
  - `PATCH /groceries/:id`: Update a grocery item (Admin only).
  - `DELETE /groceries/:id`: Delete a grocery item (Admin only).

- **Order Endpoints**
  - `POST /orders`: Create a new order.
  - `GET /orders/my-orders`: Retrieve orders for the current user.
  - `PATCH /orders/:id/status`: Update the status of an order (Vendor only).
  - `POST /orders/:id/cancel`: Cancel an order.