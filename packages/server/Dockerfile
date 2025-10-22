# Use Alpine for smaller image size
FROM node:22-alpine AS builder

WORKDIR /app

# Copy workspace and package files first for better caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/server/package.json ./packages/server/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm fetch
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY packages/server ./packages/server

# Build the application
WORKDIR /app/packages/server
RUN pnpm run build

# Production stage
FROM node:22-alpine AS runner

# Install PostgreSQL client for health checks and migrations
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy built application and necessary files
COPY --from=builder /app/packages/server/dist ./dist
COPY --from=builder /app/packages/server/package.json ./
COPY --from=builder /app/packages/server/drizzle.config.ts ./
COPY --from=builder /app/packages/server/src/db ./src/db
COPY --from=builder /app/pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod --no-frozen-lockfile

# Install drizzle-kit for schema push
RUN pnpm add drizzle-kit dotenv --save-dev

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

# Copy startup script
COPY packages/server/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

# Run migrations and start application
ENTRYPOINT ["./docker-entrypoint.sh"]