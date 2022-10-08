FROM node:alpine3.16

USER root

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000
EXPOSE 5551

CMD [ "node", "dist/main.js" ]