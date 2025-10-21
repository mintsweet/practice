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

WORKDIR /app

# Copy built application and package files
COPY --from=builder /app/packages/server/dist ./dist
COPY --from=builder /app/packages/server/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Install pnpm and production dependencies only
RUN npm install -g pnpm && \
  pnpm install --prod --no-frozen-lockfile && \
  npm uninstall -g pnpm && \
  npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

USER nestjs

EXPOSE 3000

CMD ["node", "dist/src/main.js"]