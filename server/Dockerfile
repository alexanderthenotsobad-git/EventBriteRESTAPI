# Use an official Node.js runtime as a base image
FROM node:18-slim
WORKDIR /usr/src/app
# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production
# Copy app source
COPY . ./
# Run the web service
CMD [ "npm", "start" ]
FROM node:18-slim
WORKDIR /usr/src/app

# Copy backend files
COPY package*.json ./
RUN npm install --only=production
COPY . .

# Copy static frontend files from parent directory
COPY ../index.html ./
COPY ../app.js ./

# Expose port
EXPOSE 8080

CMD [ "npm", "start" ]