#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
npx wait-on tcp:db:5432 -t 60000

# Install dependencies if needed
echo "Installing dependencies..."
npm install

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Push database schema
echo "Pushing database schema..."
npx prisma db push

# Start development server
echo "Starting development server..."
npm run dev 