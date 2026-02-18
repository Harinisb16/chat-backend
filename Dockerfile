# Use Node.js base image
FROM node:lts-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose backend port
EXPOSE 5000

# Run the dev command (uses ts-node-dev)
CMD ["npm", "run", "dev"]
