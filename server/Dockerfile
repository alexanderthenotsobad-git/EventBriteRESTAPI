# Use an official Node.js runtime as a base image
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy app source and static files (now in the same directory)
COPY . .

# Expose port
EXPOSE 8080

# Run the web service
CMD [ "npm", "start" ]