import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';

// Setting up Environment
import Config from './config/config'
import DBPool from './services/db';
import createMQConsumer from './services/consumer'

console.log('Loading Config=', Config)
process.env.APP_NAME = Config.APP_NAME
process.env.NODE_ENV = Config.ENV
process.env.LOG_FOLDER = Config.LOG_FOLDER
process.env.PORT = String(Config.PORT)

//Postgres
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'event-driven-user'; 
const DB_PASSWORD = process.env.DB_PASSWORD || 'S3cret'; 
const DB_DATABASE = process.env.DB_DATABASE || 'event-driven_db'; 

//RabbitMQ
//process.env.AMQP_URL = "amqp://guest:guest@127.0.0.1:5672";
const AMQP_URL = process.env.AMQP_URL || Config.AMQP_URL;
const QUEUE_NAME = process.env.QUEUE_NAME || Config.QUEUE_NAME;

//Logger
import loggerutils from './services/logger';
const logger = loggerutils.getInstance().getLogger();

//Constants
const PORT = process.env.PORT || 8001;
const prefix = Config.APP_NAME;

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

app.get(`/`, (req,res) => {
  res.send("alive");
});

app.get(`${prefix}`, (req,res) => {
  res.send("This is the server's notification response…")
});

app.use(`${prefix}${Config.API_VERSION}`, apiRoutes);

apiRoutes.get('/', (_req: Request, res: Response) => {
  res.json({message: 'Welcome to the coolest notification API on earth!'});
})

apiRoutes.get('/ping', (_req: Request, res: Response) => {
  res.json({message: 'notification->pong'});
})

// Test Postgres - Query
apiRoutes.get('/db', async (_req: Request, res: Response) => {
  const client = await DBPool.getInstance().acquireClient();
  const query = 'SELECT * FROM audit_logs';
  try { 
    client?.query(query, (error, result) => {
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
  } catch(err) {
    res.status(500).send({
      status: 'Failed',
      message: 'Server Error',
    });
  } finally {
    client?.release();
  }
   
});

// Test Postgres - Insert
apiRoutes.post('/db', async (req: Request, res: Response) => {
 
  const {email, password} = req.body;
  const data = {
    email : email,
    password : password,
    action : "REGISTER",
    transaction_date : new Date()
  }

  const query = 'INSERT INTO audit_logs(action, email, password, transaction_date) VALUES($1,$2,$3,$4) RETURNING *';
  const values = [data.action, data.email, data.password, data.transaction_date];
  const client = await DBPool.getInstance().acquireClient();

  try {
    client?.query(query, values, (error, result) => {
      if (error) {
        res.status(400).json({error});
      }
      res.status(200).send({
        status: 'Successful',
        result: result.rows[0],
      });
    });
  } catch(err) {
    res.status(500).send({
      status: 'Failed',
      message: 'Server Error',
    });
  } finally {
    client?.release();
  }
});

// Main
async function main() {
  //Postgres
  logger.info(`DB_HOST=${DB_HOST}, DB_USER=${DB_USER}, DB_PASSWORD=${DB_PASSWORD}, DB_DATABASE=${DB_DATABASE}`);
  DBPool.getInstance().startPool(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);

  //RabbitMQ
  logger.info(`AMQP_URL=${AMQP_URL}, QUEUE_NAME=${QUEUE_NAME}`);
  var consumerCallback = async (parsed: any) : Promise<void> => {
    console.log("consumerCallback->", parsed);
    const client = await DBPool.getInstance().acquireClient();

    try {
      const {email, password} = parsed.data;
      const data = {
        email : email,
        password : password,
        action : parsed.action,
        transaction_date : new Date()
      }

      const query = 'INSERT INTO audit_logs(action, email, password, transaction_date) VALUES($1,$2,$3,$4) RETURNING *';
      const values = [data.action, data.email, data.password, data.transaction_date];
      client?.query(query, values, (error, _result) => {
        if (error) {
          logger.error(error);
        }
        logger.info("Inserted Successfully");
      });
    } catch(err) {
      logger.error(err);
    } finally {
      client?.release();
    }
  }
  const consumer = createMQConsumer(String(AMQP_URL), String(QUEUE_NAME), consumerCallback);
  consumer();

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
  })

  // Ctrl Break Handler
  process.on('SIGINT', () => {
    console.log('Ctrl C detected');
    DBPool.getInstance().endPool();
    process.exit()
  })

  logger.info(`iosocket/web server@${PORT}`)
  logger.info(`Magic happens at http://localhost:${PORT}`)
  logger.info(`${Config.APP_FULL_NAME} ${Config.APP_VERSION} @all rights reserved. ${Config.APP_LAST_RELEASED_DATE}`)
}

main().then(() => console.log('Started successfully')).catch((ex) => console.log(ex.message))
