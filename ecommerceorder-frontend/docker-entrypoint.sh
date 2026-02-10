#!/bin/sh
# Docker entrypoint script to substitute environment variables in nginx config

# Set default backend URL if not provided
BACKEND_URL=${BACKEND_URL:-http://localhost:8080}

echo "Configuring Nginx with BACKEND_URL: $BACKEND_URL"

# Create nginx config from template with environment variable substitution
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Nginx configuration:"
cat /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
