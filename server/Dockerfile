FROM node:alpine3.16

USER root

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 5551

RUN chmod +x ./script.sh

CMD [ "/bin/sh", "-c", "./script.sh" ]