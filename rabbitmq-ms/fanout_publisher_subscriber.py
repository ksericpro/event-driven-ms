import pika, sys

# prerequisites are that you have RabbitMQ installed
# create a "darkmatter" named VirtualHost (VHOST)
#  rabbitmqctl.bat add_vhost darkmatter
# create a user APP_USER with associated APP_PASS word
#  rabbitmqctl add_user darkmatteradmin <password>
# give the APP_USER the necessary permissions
#  rabbitmqctl set_permissions -p darkmatter darkmatteradmin ".*"  ".*" ".*"

RABBITMQ_SERVER = "localhost"
EXCHANGE_DARKMATTER = "darkmatter-exchange"
VHOST_DARKMATTER = "darkmatter"
APP_USER = "darkmatteradmin"
APP_PASS = "urpassword"
STOP_PROCESSING_MESSAGE = "QRT"

__author__ = 'ericsee'

class DarkMatterLogger:
    def __init__(self):
        print("DM Logger init")
        credentials = pika.PlainCredentials(APP_USER, APP_PASS)
        conn_params = pika.ConnectionParameters(host=RABBITMQ_SERVER, virtual_host=VHOST_DARKMATTER,
                                                credentials=credentials)
        conn = pika.BlockingConnection(conn_params)
        self.channel = conn.channel()

        self.channel.exchange_declare(exchange=EXCHANGE_DARKMATTER,
                                      exchange_type="fanout",
                                      passive=False,
                                      durable=False,
                                      auto_delete=False
        )

    def sendMessage(self, message):
        msg = message
        msg_props = pika.BasicProperties()
        msg_props.content_type = "text/plain"

        self.channel.basic_publish(body=msg,
                                   exchange=EXCHANGE_DARKMATTER,
                                   properties=msg_props,
                                   routing_key="")
        print("Message sent: ", message)


# if we receive a "quit" message, then stop processing
class DarkMatterViewer:
    def __init__ (self, topic):
        print("DM Viewer init")
        self.topic = topic
        print("topic={}".format(self.topic))

        credentials = pika.PlainCredentials(APP_USER, APP_PASS)
        conn_params = pika.ConnectionParameters(host=RABBITMQ_SERVER, virtual_host=VHOST_DARKMATTER,
                                                credentials=credentials)
        conn = pika.BlockingConnection(conn_params)
        channel = conn.channel()

        #ourChan = channel.queue_declare(exclusive=True, queue='test')
        # if exclusive is True, only one consumer is allowed
        ourChan = channel.queue_declare(exclusive=False, queue=self.topic)

        channel.queue_bind(exchange=EXCHANGE_DARKMATTER, queue=ourChan.method.queue)

        # callback that runs when message arrives -- see basic_consume() below
        def msg_consumer(channel, method, header, body):
            channel.basic_ack(delivery_tag=method.delivery_tag)

            print("body={}".format(body))
            decoded_body = body.decode("utf-8")
            #print(type(body), STOP_PROCESSING_MESSAGE, decoded_string)
            if decoded_body == STOP_PROCESSING_MESSAGE:
                print("EXITING!!!")
                channel.basic_cancel(consumer_tag="DarkMatterViewer")
                channel.stop_consuming()
            return

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=self.topic, on_message_callback=msg_consumer, auto_ack=False)

        channel.start_consuming()

def main():
    # if the command line is given with the parameter send, then run this as a logger
    #   c:\Python27\python.exe DarkMatterLogger.py send
    # run the logger/sender once first to create the exchange, then can run the consumers
    #   c:\Python27\python.exe DarkMatterLogger.py
    if len(sys.argv) > 1:
        if sys.argv[1] == "send":
            dml = DarkMatterLogger()
            dml.sendMessage("hola!")
            dml.sendMessage("dos")
            dml.sendMessage("tres")
            dml.sendMessage("follow @k0emt on twitter! (that's a zero after the k)")
            dml.sendMessage(STOP_PROCESSING_MESSAGE)
        elif sys.argv[1] == "receive":
            topic="test"
            if len(sys.argv)>2:
                topic = sys.argv[2]
            dmViewer = DarkMatterViewer(topic)
    else:
        print("{} send|receive".format(sys.argv[0]))
        #dmViewer = DarkMatterViewer()

main()