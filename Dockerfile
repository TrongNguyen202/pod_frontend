# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy toàn bộ project
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "start"]
