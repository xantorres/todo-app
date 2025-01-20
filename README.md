# Todo App

A modern todo application built with Next.js 14, featuring server actions, authentication, and PostgreSQL database.

## Features

- 🔐 Authentication with NextAuth.js
- 📝 CRUD operations for tasks
- 🎯 Real-time task updates
- 🎨 Modern UI with Tailwind CSS
- 🔄 Optimistic updates
- 🐳 Docker support
- ⚡ Biome.js for fast linting and formatting
- ✅ Jest testing setup with example tests

## Code Quality

The project uses [Biome](https://biomejs.dev/) for linting and formatting, providing:
- Fast performance (written in Rust)
- Zero configuration needed
- Unified tooling (replaces ESLint + Prettier)
- TypeScript support out of the box

Run the following commands:
```bash
npm run lint    # Check for code issues
npm run format  # Format code
npm run check   # Check and auto-fix issues
```

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ (for local development)
- npm (comes with Node.js)
- Docker and Docker Compose

## Quick Start with Docker

### Development Mode (with hot reload)

```bash
# Copy environment file
cp .env.example .env

# Start the development server
docker compose up dev -d

# The app will be available at http://localhost:3000
# Any code changes will automatically reload

# To stop the app and all services
docker compose down
```

### Production Mode

```bash
# Start the production server
docker compose up app -d

# The app will be available at http://localhost:3001
```

### Database Migrations

The database schema is automatically synchronized on startup, but if you make changes to the schema:

```bash
# Apply schema changes
docker compose exec dev npx prisma db push

# Generate Prisma client after schema changes
docker compose exec dev npx prisma generate

# If you need to reset the database
docker compose exec dev npx prisma db reset
```

## Development Workflow

1. Start the development server:

```bash
docker compose up dev -d
```

2. Make changes to your code - they will automatically reload

3. If you modify the database schema (`prisma/schema.prisma`):

```bash
# Apply schema changes
docker compose exec dev npx prisma db push

# Generate Prisma client
docker compose exec dev npx prisma generate
```

4. View logs:

```bash
# Development logs
docker compose logs -f dev

# Database logs
docker compose logs -f db
```

5. Stop all services:

```bash
docker compose down
```

## Troubleshooting

### Prisma Client Issues

If you see Prisma client initialization errors:

```bash
# Regenerate Prisma client
docker compose exec dev npx prisma generate

# Verify database connection and sync schema
docker compose exec dev npx prisma db push
```

### Database Connection Issues

```bash
# Check if database is running
docker compose ps

# View database logs
docker compose logs db

# Reset database (WARNING: This will delete all data)
docker compose exec dev npx prisma db reset
```

### Creating a Test User

You can create a test user with predefined credentials using:

```bash
# Using Docker
docker compose exec dev npx ts-node scripts/create-user.ts

# Without Docker
npx ts-node scripts/create-user.ts
```

This will create a user with:
- Email: test@example.com
- Password: password123

## Manual Setup (Without Docker)

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Update `.env` to use localhost database:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo_app"
```

4. Start the PostgreSQL database:

```bash
docker compose up -d db
```

5. Set up the database:

```bash
npm run prisma:generate
npm run prisma:push
```

6. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run check` - Run Biome checks and auto-fix issues
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push database schema changes

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── actions/         # Server actions
│   ├── api/            # API routes
│   └── ...
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── tasks/          # Task-related components
│   └── ...
├── lib/                # Utility functions
├── prisma/             # Database schema
└── types/              # TypeScript types
```

## Testing

The project is set up with Jest and React Testing Library. Several example tests are included for components and functionality.

Run tests with:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Test files are located alongside their components with the `.test.tsx` extension.

## License

MIT License - see [LICENSE](LICENSE) file for details.
