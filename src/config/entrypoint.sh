#!/bin/sh
set -e

DB_HOST="postgres"
DB_PORT=${PG_PORT:-5432}

echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT} to be ready..."

# Wait until PostgreSQL is accepting connections
while ! nc -zv "$DB_HOST" "$DB_PORT"; do
  echo "PostgreSQL is not ready yet. Sleeping for 1 second..."
  sleep 1
done

echo "PostgreSQL is up - executing migrations..."

# Run pending migrations
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/database/data.source.ts

echo "Starting the app..."
npm run start:dev