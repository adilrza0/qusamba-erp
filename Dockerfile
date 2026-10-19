# ─── Multi-Stage Dockerfile for Qusamba ERP Full-Stack Deployment ───

# Stage 1: Build Frontend SPA
FROM node:20-alpine AS client-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Server Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install server production dependencies
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server application files
COPY server/ ./

# Copy compiled frontend from Stage 1 into /app/dist
WORKDIR /app
COPY --from=client-builder /app/dist ./dist

# Working directory for execution
WORKDIR /app/server

EXPOSE 5000

CMD ["node", "server.js"]
