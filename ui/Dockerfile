# Build stage
FROM node:21 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

COPY . .

# Install dependencies
RUN npm ci

# Set the environment variable for production
ENV REACT_APP_ENV=production
ENV HTTPS=true

# Build the app
RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Copy the nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
