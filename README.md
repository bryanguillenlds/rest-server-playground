# REST Playground - Educational Template

A clean, well-structured REST API template built with TypeScript, Express, and Prisma. This project serves as a **teaching template for mentoring junior developers** on the fundamentals of building RESTful APIs, including architecture patterns, validation, database interactions, and best practices.

## 🎯 Purpose

This project demonstrates:

- **RESTful API design** with proper HTTP methods and status codes
- **Clean Architecture** with separation of concerns (Domain, Presentation, Data layers)
- **DTOs (Data Transfer Objects)** for input validation and type safety
- **Prisma ORM** for type-safe database operations
- **TypeScript** for better code quality and developer experience
- **Express.js** middleware and routing patterns
- **Docker Compose** for local development environment setup

## 🏗️ Architecture

```
src/
├── domain/          # Business logic and DTOs (validation)
├── presentation/    # Controllers, routes, and server setup
├── data/            # Database access layer (Prisma)
└── config/          # Environment configuration
```

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rest-playground
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory. If a `.env.template` exists, copy it:

```bash
cp .env.template .env
```

Then edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
PUBLIC_PATH=public

# Database Configuration
POSTGRES_URL=postgresql://your_user:your_password@localhost:5432/your_database
POSTGRES_USER=your_user
POSTGRES_DB=your_database
POSTGRES_PASSWORD=your_password
```

**Important**: Replace the placeholder values with your own configuration. The database credentials should match what you'll use in Docker Compose.

### 4. Start the Database

Start PostgreSQL using Docker Compose:

```bash
docker compose up -d
```

This will:

- Start a PostgreSQL 15.3 container
- Expose the database on port `5432`
- Persist data in the `./postgres` directory

### 5. Run Database Migrations

Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

### 6. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 📚 API Endpoints

The API provides CRUD operations for a Todo resource:

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a todo by ID
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## 🧠 Learning Points

This template covers:

1. **DTOs**: Input validation using Data Transfer Objects (`CreateTodoDto`, `UpdateTodoDto`)
2. **Route Parameters**: Validating and extracting IDs from URL parameters
3. **HTTP Status Codes**: Proper use of 200, 201, 400, 404
4. **Idempotency**: Handling updates when no changes are detected
5. **Error Handling**: Consistent error response format
6. **Type Safety**: Leveraging TypeScript and Prisma for type-safe operations
7. **Clean Architecture**: Separation between domain logic, presentation, and data access

## 🛑 Stopping the Application

To stop the development server, press `Ctrl+C` in the terminal.

To stop the database container:

```bash
docker compose down
```

To stop and remove all data:

```bash
docker compose down -v
```

## 📝 Notes for Mentors

This codebase is designed to be:

- **Readable**: Clear naming conventions and structure
- **Educational**: Comments explain "why" not just "what"
- **Extensible**: Easy to add new features or resources
- **Best Practices**: Follows REST conventions and TypeScript best practices

Perfect for teaching junior developers about API design, validation patterns, and clean code architecture.
