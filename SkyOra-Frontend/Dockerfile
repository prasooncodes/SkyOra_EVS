### Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source and build the SSR-enabled Angular app
COPY . .
RUN npm run build --silent

### Runtime stage
FROM node:18-alpine AS runtime
WORKDIR /app

# Default port (overridable by Render via PORT env var)
ENV PORT=4000

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev --silent

# Copy built artifacts from builder
COPY --from=build /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/SkyOra-Frontend/server/server.mjs"]
