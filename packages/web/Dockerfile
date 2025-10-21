# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy workspace and package files first for better caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/web/package.json ./packages/web/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm fetch
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY packages/web ./packages/web

# Build the application
WORKDIR /app/packages/web
RUN pnpm run build

# Production stage - serve with nginx
FROM nginx:alpine AS runner

# Copy built static files
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user for security
RUN addgroup -g 1001 -S nginx-group && \
  adduser -S nginx-user -u 1001 -G nginx-group

# Set proper permissions
RUN chown -R nginx-user:nginx-group /usr/share/nginx/html && \
  chown -R nginx-user:nginx-group /var/cache/nginx && \
  chown -R nginx-user:nginx-group /var/log/nginx && \
  chown -R nginx-user:nginx-group /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R nginx-user:nginx-group /var/run/nginx.pid

USER nginx-user

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]