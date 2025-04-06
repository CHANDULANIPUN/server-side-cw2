# frontend/Dockerfile

# Use the official Node.js image for building the app
FROM node:14 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 3000

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]