FROM node:16.13.0-alpine3.12

RUN mkdir -p /app/server
WORKDIR /app/server

COPY package.json .

RUN yarn global add nodemon
RUN yarn install

COPY . .

EXPOSE 8080

CMD ["nodemon", "src/server.ts"]
