# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the web application first (React/Vite)
RUN pnpm run build:web

# Build the server application (TypeScript)
RUN pnpm run build:server

# Expose the port (Railway will set $PORT)
EXPOSE $PORT

# Start the server
CMD ["node", "apps/server/dist/index.js"]
