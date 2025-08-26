# --- Builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy lockfiles first for better caching
COPY package*.json ./
COPY tsconfig.json ./

# Install deps WITHOUT running lifecycle scripts (so 'prepare' won't run yet)
RUN npm ci --ignore-scripts

# Now copy sources and build
COPY src ./src
RUN npm run build

# --- Production stage ---
FROM node:20-alpine
ENV NODE_ENV=production
ENV AISEARCHAPI_KEY=as-dev-your-api-key-here

# Small init for proper signal handling
RUN apk add --no-cache dumb-init

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app

# Copy only package files and install prod deps, skip scripts
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built app
COPY --from=builder /app/dist ./dist

# Permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

# Entrypoint & command
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]

# Healthcheck (adjust if your app doesn't support --list-tools)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/index.js --list-tools || exit 1
