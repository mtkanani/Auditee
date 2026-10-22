FROM node:20-slim

# Install OpenSSL for Prisma engine compatibility
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package manifests and prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies (runs postinstall prisma generate)
RUN npm ci

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 8080

# Start backend (includes prisma db push & server start as defined in package.json)
CMD ["npm", "start"]

