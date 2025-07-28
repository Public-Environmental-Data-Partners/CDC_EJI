FROM nginx:alpine

# Copy custom config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy static frontend files
COPY web /usr/share/nginx/html