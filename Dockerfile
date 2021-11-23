# syntax=docker/dockerfile:1

FROM node:12.13.0-alpine as node
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

ARG SHEPHERDME_API_URL
ENV SHEPHERDME_API_URL="http://169.51.206.176:32451/model/predict"

EXPOSE 9001

CMD [ "npm", "i" ]
CMD [ "ng", "serve" ]
