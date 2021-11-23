# syntax=docker/dockerfile:1

FROM node:12-alpine as node
ENV NODE_ENV=production

# /app might be used already on the container
WORKDIR /usr/local/shepherd

COPY . /usr/local/shepherd

ENV PATH /usr/local/shepherd/node_modules/.bin:$PATH

RUN rm -rf node_modules
RUN npm install
RUN npm install -g @angular/cli@10.0.3
#RUN npm rm @angular-devkit/build-angular && rm -f package-lock.json && npm install -D @angular-devkit/build-angular && npm install
# RUN npm run ng update
RUN npm run build
# Build pre-emptively for faster start-up time
# RUN npm run build

ENV SHEPHERDME_API_URL="http://169.51.206.176:32451/model/predict"

# Since the last command is ng serve, expose port 4200 as per the documentation on the README
EXPOSE 4200 

# use npm start since ng might not be accessible globally
CMD [ "npm", "run", "start" ]
