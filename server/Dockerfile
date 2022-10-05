FROM node:alpine3.16

USER root

WORKDIR /app
COPY . .
RUN chmod 700 script.sh
RUN npm install

EXPOSE 5000
EXPOSE 5551

CMD sh ./script.sh