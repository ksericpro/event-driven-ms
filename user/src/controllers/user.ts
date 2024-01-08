import {
  Controller,
  Get,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";

import { MQProducer } from '../services/producer';
import Common from '../services/common';

//Logger
import loggerutils from '../services/logger';
const logger = loggerutils.getInstance().getLogger();

interface PingResponse {
  message: string;
}

@Route("user")
export default class UserController extends Controller {
  @Get("/")
  public async getMessage(): Promise<PingResponse> {
    return {
      message: "user->pong",
    };
  }

  @SuccessResponse("200", "OK") 
  @Post("/login")
  public async login(@Query() email?: string,
  @Query() password?: string): Promise<string>{ 
    console.log(`Login user...${email}, ${password}`);
    if (!Common.checkNull(password) || !Common.checkNull(email)){
      console.error("Missing Paramaters");
      this.setStatus(400); 
      return "NOT OK";
    }
    const msg = {
      action: 'LOGIN',
      data: { email, password},
    };

    logger.info(`Sending Msg to RabbitMQ=${JSON.stringify(msg)}`);
    MQProducer.send(JSON.stringify(msg));

    this.setStatus(200); 
    return "OK";
  }

  @Post("/register")
  public async register(@Query() email?: string,
  @Query() password?: string): Promise<string> { 
    console.log(`Registering user...${email}, ${password}`);

    if (!Common.checkNull(password) || !Common.checkNull(email)){
      console.error("Missing Paramaters");
      this.setStatus(400); 
      return "NOT OK";
    }
    const msg = {
      action: 'REGISTER',
      data: { email, password},
    };

    logger.info(`Sending Msg to RabbitMQ=${JSON.stringify(msg)}`);
    //producer(JSON.stringify(msg));
    MQProducer.send(JSON.stringify(msg));

    this.setStatus(200); 
    return "OK";
  }
}