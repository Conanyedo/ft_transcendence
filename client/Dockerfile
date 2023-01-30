FROM node:alpine3.16

USER root

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@9.4.0
RUN npm install --silent

COPY . .

EXPOSE 3000

RUN chmod +x ./script.sh

CMD [ "/bin/sh", "-c", "./script.sh" ]