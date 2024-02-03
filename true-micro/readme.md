# links
[Fanout Code] (https://gist.github.com/k0emt/1218497/d5fe2ac6f7c17fc6fd3e62fa690e2fdac7e06c87)

[Fanout] (https://www.cloudamqp.com/blog/rabbitmq-fanout-exchange-explained.html)


# Architecture
Publisher -> RabbitMQ (VH->exchange)

Subcriber <- RabbitMQ (VH->xxchange)


# RabbitMQ Management

## test
- curl -i -u guest:guest http://localhost:15672/api/vhosts

## Browser
http://localhost:15672
guest/guest

# notes
- There are several types of exchanges. The fanout exchange ignores the routing key and sends messages to all queues. But pretty much all other exchange types use the routing key to determine which queue, if any, will receive a message.