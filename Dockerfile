FROM node:20-alpine AS builder
WORKDIR /app


COPY package*.json ./
RUN npm ci


COPY . .
RUN npm run build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html


RUN rm -rf ./*

# Copy the compiled Vite artifacts from the builder stage
COPY --from=builder /app/dist .

# Expose port 80 to the host
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]