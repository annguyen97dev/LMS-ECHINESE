FROM node:14.17.0-buster

WORKDIR /code

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

CMD npm install