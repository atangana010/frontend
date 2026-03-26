# Dockerfile pour le frontend React avec Nginx
FROM node:20-alpine AS builder
WORKDIR /app

ARG REACT_APP_API_URL
ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_ANON_KEY

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL
ENV REACT_APP_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_ANON_KEY

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Serveur Nginx pour la production
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Configuration Nginx pour React Router
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
    gzip on; gzip_types text/plain text/css application/json application/javascript; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]