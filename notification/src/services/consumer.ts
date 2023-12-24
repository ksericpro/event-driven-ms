import amqp, { Message } from 'amqplib/callback_api'

const createMQConsumer = (amqpURl: string, queueName: string, callback: (data: any) => any) => {
  console.log('Connecting to RabbitMQ...')
  return () => {
    amqp.connect(amqpURl, (errConn, conn) => {
      if (errConn) {
        throw errConn
      }

      conn.createChannel((errChan, chan) => {
        if (errChan) {
          throw errChan
        }

        console.log('Connected to RabbitMQ');
        chan.assertQueue(queueName, { durable: true })
        chan.consume(queueName, (msg: Message | null) => {
          if (msg) {
            const parsed = JSON.parse(msg.content.toString())
            switch (parsed.action) {
            case 'REGISTER':
              console.log('Consuming REGISTER action', parsed.data);
              callback(parsed);
              break
            case 'LOGIN':
              console.log('Consuming LOGIN action', parsed.data);
              callback(parsed);
              break
            default:
              break
            }
          }
        }, { noAck: true })
      })
    })
  }
}

export default createMQConsumer
