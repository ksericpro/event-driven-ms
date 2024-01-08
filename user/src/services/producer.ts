import amqp, { Connection } from 'amqplib/callback_api'

class MQProducer {
  private static _init = false;
  private static amqpUrl: string;
  private static queueName: string;
  private static ch: any;

  private static setParamaters(amqpUrl: string, queueName: string){
    this.amqpUrl = amqpUrl;
    this.queueName = queueName;
  }

  // Connect one time
  public static connect(mqpUrl: string, queueName: string) {
    console.log('Connecting to RabbitMQ...');
    if (this._init){
      console.log("Already connected");
      return true;
    }
    this.setParamaters(mqpUrl, queueName);
    amqp.connect(this.amqpUrl, (errorConnect: Error, connection: Connection) => {
      if (errorConnect) {
        console.log('Error connecting to RabbitMQ: ', errorConnect)
        return false;
      }
  
      connection.createChannel((errorChannel, channel) => {
        if (errorChannel) {
          console.log('Error creating channel: ', errorChannel)
          return false;
        }
  
        this.ch = channel
        console.log('Connected to RabbitMQ')
      })
    })
    this._init = true;
    return true;
  }

  static send(msg: string){
    console.log('Produce message to RabbitMQ...')
    this.ch.sendToQueue(this.queueName, Buffer.from(msg))
  }
}


const createMQProducer = (amqpUrl: string, queueName: string) => {
  console.log('Connecting to RabbitMQ...')
  let ch: any
  amqp.connect(amqpUrl, (errorConnect: Error, connection: Connection) => {
    if (errorConnect) {
      console.log('Error connecting to RabbitMQ: ', errorConnect)
      return
    }

    connection.createChannel((errorChannel, channel) => {
      if (errorChannel) {
        console.log('Error creating channel: ', errorChannel)
        return
      }

      ch = channel
      console.log('Connected to RabbitMQ')
    })
  })
  return (msg: string) => {
    console.log('Produce message to RabbitMQ...')
    ch.sendToQueue(queueName, Buffer.from(msg))
  }
}

//export default createMQProducer;

export {
  createMQProducer,
  MQProducer
};