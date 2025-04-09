# Use the official Node.js image
FROM node:16.9.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Rebuild native modules
RUN npm rebuild

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 5001

# Start the application
CMD ["node", "server.js"]