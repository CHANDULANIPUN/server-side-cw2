# backend/Dockerfile

# Stage 1: Build
FROM node:16 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild sqlite3 to match the container's environment
RUN npm rebuild sqlite3 --build-from-source

# Copy the rest of the application code
COPY . .

# Stage 2: Run
FROM node:16

WORKDIR /usr/src/app

# Copy the built application from the build stage
COPY --from=build /usr/src/app .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]