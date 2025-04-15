FROM node:18-alpine

WORKDIR /usr/src/app

# Install build dependencies for SQL Server driver
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]