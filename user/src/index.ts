import express, { Application } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
//import Router from "./routes";
//import cors from 'cors';
import userRoute from "./routes/user";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

//Setting up Environment
import Config from "./config/config";

import { MQProducer } from './services/producer';
import Common from './services/common';

console.log("Loading Config=", Config);
process.env.APP_NAME = Config.APP_NAME;
process.env.NODE_ENV = Config.ENV;
process.env.LOG_FOLDER = Config.LOG_FOLDER;
process.env.PORT = String(Config.PORT);

//Rabbit MQ
//process.env.AMQP_URL = "amqp://guest:guest@127.0.0.1:5672";
const AMQP_URL = process.env.AMQP_URL || Config.AMQP_URL;
const QUEUE_NAME = process.env.QUEUE_NAME || Config.QUEUE_NAME;

//Logger
import loggerutils from './services/logger';
const logger = loggerutils.getInstance().getLogger();

//Constants
const PORT = process.env.PORT || 8000;

//Routes
const app: Application = express();

app.use(bodyParser.json({limit: Config.MAX_FILE_SIZE}));
app.use(bodyParser.urlencoded({limit: Config.MAX_FILE_SIZE, extended: true}));
app.use(cookieParser());

//app.use(cors);
app.use(express.json());
app.use(morgan("tiny"));
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

app.get("/", (req,res) => {
  res.send("This is the server's user response…")
});

app.use(Config.API_VERSION, apiRoutes);

apiRoutes.get('/', function(_req, res) {
  res.json({message: 'Welcome to the coolest user API on earth!'});
});

//Test RabbitMQ
apiRoutes.post('/message', function(req, res) {
  const {email, password} = req.body;
  if (!Common.checkNull(password) || !Common.checkNull(email)){
    console.error("Missing Paramaters");
    return res.status(400).send("Error");
  }
  const msg = {
    action: 'REGISTER',
    data: { email, password},
  };

  logger.info(`Sending Msg to RabbitMQ=${JSON.stringify(msg)}`);
  MQProducer.send(JSON.stringify(msg));
  return res.send('OK')
});

//Info Routes
logger.info('/user api route added.');
apiRoutes.use('/user', userRoute);

//Main
async function main() {

  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );

  //RabbitMQ
  logger.info(`AMQP_URL=${AMQP_URL}, QUEUE_NAME=${QUEUE_NAME}`);
  MQProducer.connect(String(AMQP_URL), String(QUEUE_NAME));

  // Ctrl Break Handler
  process.on('SIGINT', function() {
    console.log('Ctrl C detected');
    process.exit();
  })

  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });

  logger.info("iosocket/web server@"+PORT);
  logger.info('Magic happens at http://localhost:' + PORT);
  logger.info(`${Config.APP_FULL_NAME} ${Config.APP_VERSION} @all rights reserved. ${Config.APP_LAST_RELEASED_DATE}`);
}

main().then(() => console.log('Started successfully')).catch((ex) => console.log(ex.message));