FROM node:22-alpine3.23

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./


RUN yarn install
COPY . .
EXPOSE 3000