// import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'

// Setting up Environment
import Config from './config/config'
import createMQConsumer from './utils/consumer'

// Logger
import loggerutils from './utils/logger'

// dotenv.config()

console.log('Loading Config=', Config)
process.env.APP_NAME = Config.APP_NAME
process.env.NODE_ENV = Config.ENV
process.env.LOG_FOLDER = Config.LOG_FOLDER
process.env.PORT = String(Config.PORT)
process.env.AMQP_URL = Config.AMQP_URL
process.env.QUEUE_NAME = Config.QUEUE_NAME
const logger = loggerutils.getInstance().getLogger()

const PORT = parseInt(String(process.env.PORT), 10) || 3000
const AMQP_URL = String(process.env.AMQP_URL)
const QUEUE_NAME = String(process.env.QUEUE_NAME)

const app = express()
const consumer = createMQConsumer(AMQP_URL, QUEUE_NAME)

consumer()
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

// Main
async function main() {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
  })

  // Ctrl Break Handler
  process.on('SIGINT', () => {
    console.log('Ctrl C detected')
    process.exit()
  })

  logger.info(`iosocket/web server@${PORT}`)
  logger.info(`Magic happens at http://localhost:${PORT}${Config.APP_NAME}`)
  logger.info(`${Config.APP_FULL_NAME} ${Config.APP_VERSION} @all rights reserved. ${Config.APP_LAST_RELEASED_DATE}`)
}

main().then(() => console.log('Started successfully')).catch((ex) => console.log(ex.message))
