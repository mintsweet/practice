#!/bin/sh
set -e

echo "🚀 Starting application setup..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until pg_isready -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" >/dev/null 2>&1; do
	echo "Database is unavailable - sleeping"
	sleep 2
done

echo "✅ Database is ready!"

# Push database schema using Drizzle
echo "🔄 Pushing database schema with Drizzle..."
pnpm db:push

# Check if database needs seeding (only on first run)
if [ "${RUN_SEED:-false}" = "true" ]; then
	echo "🌱 Seeding database..."
	pnpm db:seed
fi

# Start the application
echo "🎉 Starting NestJS application..."
exec node dist/src/main.js
