## Description
This is the USER Microservice.
It provide a template of:
- API = Express
- Unit Testing = Jest
- Swagger = Tsoa
- Containerization = docker, kubernetes
- ESB = RabbotMQ 

## Links

## setup permissions
- sudo usermod -aG sudo ericsee
- sudo usermod -aG docker ericsee
- sudo groups ericsee
- sudo systemctl restart docker

[reference] (https://docs.docker.com/engine/install/linux-postinstall/)

## Installing dependencies
- npm i -S @types/fs-extra @types/cookie-parser
- npm i -S fs-extra winston winston-daily-rotate-file cookie-parser express
- npm i --save-dev @types/express @types/amqplib nodemon
- npm i express amqplib body-parser

## Normal
- npm run build
- npm start
- npm run dev

## Docker
- docker build -t user-ms .
- docker run -p 8000:8000 user-ms

## Docker-compose
- docker-compose up --build --detach
- docker-compose down

## Open browser
http://localhost:8000/


## Curl commands

### Api root
- curl http://localhost:8000/api/v1

### Swagger
- curl http://localhost:8000/swagger/

### Check API alive
- curl localhost:8000/api/v1/user/ping

## Esint
- npm init @eslint/config
- npm run lint

## Unit Testing
- npm i -D ts-jest
- npx ts-jest config:init
- npm test

## Rabbitmq
- amqps://epacexed:OHvwqlBldc_l8D524xK6ySt_XZ_py4-9@mustang.rmq.cloudamqp.com/epacexed