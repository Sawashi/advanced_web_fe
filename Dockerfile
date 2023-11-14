# Check out https://hub.docker.com/_/node to select a new base image
FROM node:12-alpine

# Install node compile native
RUN apk add g++ make python3

RUN mkdir -p /home/app

WORKDIR /home/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile
# Bundle app source code
COPY . .

RUN yarn install

# Install next-boost for deploy in production
RUN yarn add next-boost

RUN yarn build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0

CMD [ "yarn", "start:production" ]
