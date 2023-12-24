## install dependencies
- npm init @eslint/config
- npm i --save-dev @types/pg

## setup
- npm install
- npm run build
- npm run create
- npm start

## Docker
- docker build -t notification-ms .
- docker run -p 8001:8001 notification-ms

## Accessing PGadmin
- http://localhost:8888

PGADMIN_DEFAULT_EMAIL: admin@admin.com
PGADMIN_DEFAULT_PASSWORD: S3cret

## Curl Scripts
### Api root
- curl http://localhost:8001/notification/api/v1

### Check API alive
- curl localhost:8001/notification/api/v1/ping

### Postgres
- curl localhost:8001/notification/api/v1/db
- curl -H "content-type:application/json" -XPOST -d "{\"email\":\"test@gmail.com\", \"password\":\"123\"}" localhost:8001/notification/api/v1/db