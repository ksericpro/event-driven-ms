## Introduction
It provide a template of:
- API = Express
- Unit Testing = Jest
- Swagger = Tsoa
- Code Quality = Eslint
- Containerization = docker, docker-compose, kubernetes
- ESB = RabbitMQ 
- PostGres user = Pooling
- Pgadmin
- Kubernetes with Nginx Ingress Controller

## Docker
### all
- docker-compose up --build --detach
- docker logs --follow  84d2711628dd
### Some
- docker-compose build user-ms
- docker-compose start user-ms rabbitmq
- docker run -p 8888:80 --env PGADMIN_DEFAULT_EMAIL=admin@admin.com --env PGADMIN_DEFAULT_PASSWORD=S3cret dpage/pgadmin4

## Accessing RabbitMQ
- Open browser to localhost:15672
- Login using guest@guest

## Accessing PGadmin
- http://localhost:8888

PGADMIN_DEFAULT_EMAIL: admin@admin.com
PGADMIN_DEFAULT_PASSWORD: S3cret

## Curl scripts
### Login
- curl -H "content-type:application/json" -XPOST -d "{\"email\":\"test@gmail.com\", \"password\":\"123\"}" localhost:8000/api/v1/user/login

### Register
- curl -H "content-type:application/json" -XPOST -d "{\"email\":\"test@gmail.com\", \"password\":\"123\"}" localhost:8000/api/v1/user/register

### Test Send RabbitMQ
- curl -H "content-type:application/json" -XPOST -d "{\"email\":\"test@gmail.com\", \"password\":\"123\"}" -XPOST http://localhost:8000/api/v1/message

### Test End to End Postgres
- curl -H "content-type:application/json" -XPOST -d "{\"email\":\"test@gmail.com\", \"password\":\"123\"}" localhost:8000/api/v1/user/register

## Links
- [part1 - Express API with Typescript] (https://rsbh.dev/blogs/rest-api-with-express-typescript)

- [part2 - Docker] (https://rsbh.dev/blogs/rest-api-express-typescript-docker)

- [part3] - PostGres & Type orm] (https://rsbh.dev/blogs/rest-api-express-postgres-typeorm)

- [Unit Testing] (https://rsbh.dev/blogs/rest-api-express-typescript-jest-testing)

- [Using Modules in Typescript] (https://www.digitalocean.com/community/tutorials/how-to-use-modules-in-typescript)

- [Singleton] (https://refactoring.guru/design-patterns/singleton/typescript/example)

- [Esint] (https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/)

- [jest] (https://www.softwaretestinghelp.com/jest-testing-tutorial/)

- [tsoa] (https://tsoa-community.github.io/docs/getting-started.html)

- [Event-Driven Architecture with TypeScript and RabbitMQ] (https://medium.com/nerd-for-tech/event-driven-architecture-with-typescript-and-rabbitmq-e9bafee5ab2d)

- [CloudAmqp] (https://customer.cloudamqp.com/instance)

- [Kubernetes] (https://medium.com/@mrcyna/simple-nodejs-project-with-typescript-and-kubernetes-part-1-929c04955ffd)

- [Docker-compose] (https://www.baeldung.com/ops/docker-compose-links-depends-on)

- [Postgres without orm] (https://dev.to/ogwurujohnson/-persisting-a-node-api-with-postgresql-without-the-help-of-orms-like-sequelize-5dc5)

- [Postgres without orm-git] (https://github.com/ogwurujohnson/AwesomeNodePostgres)

- [Postgres Pool] (https://node-postgres.com/apis/pool)