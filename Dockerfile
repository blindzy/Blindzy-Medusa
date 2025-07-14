# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port Medusa listens on
EXPOSE 9000

# Default command
CMD ["npm", "run", "dev"]
