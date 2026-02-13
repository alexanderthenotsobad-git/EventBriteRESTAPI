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
