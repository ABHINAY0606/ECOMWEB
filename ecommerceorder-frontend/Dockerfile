# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Serve stage
FROM nginx:alpine

# Install gettext for envsubst command
RUN apk add --no-cache gettext

# Copy built Angular app
COPY --from=build /app/dist/ecommerceorder-frontend/browser /usr/share/nginx/html/browser

# Copy nginx config as template (will be processed by entrypoint)
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Environment variable for backend URL (can be overridden at runtime)
ENV BACKEND_URL=http://localhost:8080

EXPOSE 80

# Use custom entrypoint to substitute environment variables
ENTRYPOINT ["/docker-entrypoint.sh"]
