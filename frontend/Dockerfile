### STAGE 1: Dependecies fetch ###

# We label our stage as ‘dependecies’
FROM node:11-alpine as dependecies

RUN mkdir /ng-app

#COPY frontend/package.json frontend/yarn.lock frontend/semantic.json /ng-app/
COPY package.json yarn.lock /ng-app/

WORKDIR /ng-app

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN yarn install --pure-lockfile

### STAGE 2: Build ###
FROM node:11-alpine as builder

RUN mkdir -p build-context && mkdir -p build-context/ng-app

## From ‘dependecies’ stage copy over the dependecies in current folder
COPY --from=dependecies /ng-app /build-context/ng-app

WORKDIR /build-context/ng-app
COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build

### STAGE 3: Build ###
FROM nginx:alpine

### Maintainer ###
MAINTAINER bvdmitri <bvdmitri@gmail.com>

## Copy our default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /build-context/ng-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
