import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import pool from './services/db';

// Setting up Environment
import Config from './config/config'
import createMQConsumer from './services/consumer'

console.log('Loading Config=', Config)
process.env.APP_NAME = Config.APP_NAME
process.env.NODE_ENV = Config.ENV
process.env.LOG_FOLDER = Config.LOG_FOLDER
process.env.PORT = String(Config.PORT)

//RabbitMQ
//process.env.AMQP_URL = "amqp://guest:guest@127.0.0.1:5672";
const AMQP_URL = process.env.AMQP_URL || Config.AMQP_URL;
const QUEUE_NAME = process.env.QUEUE_NAME || Config.QUEUE_NAME;

//Logger
import loggerutils from './services/logger';
const logger = loggerutils.getInstance().getLogger();

//Constants
const PORT = process.env.PORT || 8001;

//Express
const app = express();
app.use(bodyParser.json({limit: Config.MAX_FILE_SIZE}));
app.use(bodyParser.urlencoded({limit: Config.MAX_FILE_SIZE, extended: true}));
app.use(express.static("public"));

// middleware to use for all requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, x-access-token, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', "true");
  console.log(req.body);
  next(); // make sure we go to the next routes and don't stop here
});

// API ROUTES 
const apiRoutes = express.Router();

app.use(process.env.APP_NAME + Config.API_VERSION, apiRoutes);

apiRoutes.get('/', (_req: Request, res: Response) => {
  res.json({message: 'Welcome to the coolest notification API on earth!'});
})

apiRoutes.get('/ping', (_req: Request, res: Response) => {
  res.json({message: 'notification->pong'});
})

// Test Postgres - Query
apiRoutes.get('/db', (_req: Request, res: Response) => {
  pool.connect((_err, client, done) => {
    const query = 'SELECT * FROM audit_logs';
  
    client?.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({error})
      } 

      if(Number(result.rows)==0) {
        res.status(404).send({
          status: 'Failed',
          message: 'No audit log information found',
        });
      } else {
        res.status(200).send({
          status: 'Successful',
          message: 'Audit Log Information retrieved',
          audit_logs: result.rows,
        });
      }
    });
  });
});

// Test Postgres - Insert
apiRoutes.post('/db', (req: Request, res: Response) => {
 
  const {email, password} = req.body;

  const data = {
    email : email,
    password : password,
    action : "REGISTER",
    transaction_date :'123'
  }

  pool.connect((_err, client, done) => {
    const query = 'INSERT INTO audit_logs(action, email, password, transaction_date) VALUES($1,$2,$3,$4) RETURNING *';
    const values = [data.action, data.email, data.password, data.transaction_date];

    client?.query(query, values, (error, result) => {
      done();
      if (error) {
        res.status(400).json({error});
      }
      res.status(202).send({
        status: 'Successful',
        result: result.rows[0],
      });
    });
  });
});

// Main
async function main() {
  //RabbitMQ
  logger.info(`AMQP_URL=${AMQP_URL}, QUEUE_NAME=${QUEUE_NAME}`);
  const consumer = createMQConsumer(String(AMQP_URL), String(QUEUE_NAME));
  consumer();

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
