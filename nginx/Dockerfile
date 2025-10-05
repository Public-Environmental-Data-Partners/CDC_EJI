FROM nginx:alpine

# Copy custom config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy static frontend files
COPY --chmod=755 web /usr/share/nginx/html