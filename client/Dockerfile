FROM node:alpine3.16

USER root

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN chmod 700 script.sh

EXPOSE 3000

CMD	sh ./script.sh