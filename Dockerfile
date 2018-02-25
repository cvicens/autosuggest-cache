# [START all]
FROM node:6.12.3-alpine

# GIT tag to be used in the code to show the tag deployed
ARG BUILDTIME_GIT_TAG=NO_TAG
ENV GIT_TAG=$BUILDTIME_GIT_TAG

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]

# [END all]
