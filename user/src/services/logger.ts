import winston from 'winston';
import fs_extra from 'fs-extra';
import DailyRotateFile from 'winston-daily-rotate-file';
import Config from "../config/config";

const fileLog: DailyRotateFile = new DailyRotateFile({
  filename: `${Config.LOG_FOLDER}${Config.APP_NAME}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '40m',
  maxFiles: '14d',
  handleExceptions: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`
    }),
  ),
})

const consoleLog = new (winston.transports.Console)({
  level: 'info',
  handleExceptions: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`
    }),
  ),
})

class loggerutils {
  private static instance: loggerutils;

  private logDir = Config.LOG_FOLDER || 'logs';

  private logger: any;

  private _init = false;

  private constructor() {
    console.log('loggerutils:contructor');
  }

  public static getInstance(): loggerutils {
    if (!loggerutils.instance) {
      loggerutils.instance = new loggerutils();
    }

    return loggerutils.instance;
  }

  init() {
    console.log(`Checking/Create on folder ${this.logDir}`)
    fs_extra.ensureDirSync(this.logDir)

    this.logger = winston.createLogger({
      transports: [
        consoleLog,
        fileLog
      ],
    })

    this._init = true;
  }

  ping() {
    return 'pong';
  }

  getLogger() {
    if (!this._init) this.init();
    return this.logger;
  }
}

export default loggerutils;
