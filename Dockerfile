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

CMD ["npm", "run", "start"]
