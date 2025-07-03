# Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Cài dependencies
RUN npm install

COPY . .

# Build Next.js app
RUN npm run build

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "run", "start"]