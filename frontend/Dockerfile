# frontend/Dockerfile
FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]