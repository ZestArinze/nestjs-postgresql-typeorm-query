import { join } from 'path';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import * as CloudWatchTransport from 'winston-cloudwatch';
import * as winston from 'winston';

const logsDir = join(process.cwd(), 'logs');

const appName: string = process.env.APP_NAME;
const cwGroupName: string = process.env.AWS_CLOUDWATCH_GROUP_NAME;
const accessKeyId: string = process.env.AWS_IAM_ACCESS_KEY;
const secretAccessKey: string = process.env.AWS_IAM_KEY_SECRET;
const awsRegion: string = process.env.APP_AWS_REGION;

const awsCloudWatchTransport = new CloudWatchTransport({
  awsOptions: {
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region: awsRegion,
  },
  name: `${appName} Logs`,
  logGroupName: cwGroupName,
  logStreamName: cwGroupName,
  messageFormatter: function (item) {
    return item.level + ': ' + item.message + ' ' + JSON.stringify(item.meta);
  },
});

const consoleTransport = new winston.transports.Console({
  level: 'silly',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.colorize({
      colors: {
        info: 'blue',
        debug: 'yellow',
        error: 'red',
      },
    }),
  ),
});

export const loggerTransports: Record<string, winston.transport> = {
  combinedFile: new winstonDailyRotateFile({
    dirname: logsDir,
    filename: 'combined',
    extension: '.log',
    level: 'info',
    maxSize: '5mb',
    maxFiles: '1d',
  }),
  errorFile: new winstonDailyRotateFile({
    dirname: logsDir,
    filename: 'error',
    extension: '.log',
    level: 'error',
    maxSize: '15mb',
    maxFiles: '14d',
  }),
  exceptionFile: new winstonDailyRotateFile({
    dirname: logsDir,
    filename: 'exception',
    extension: '.log',
    level: 'error',
    maxSize: '25mb',
    maxFiles: '14d',
  }),
  rejectionFile: new winstonDailyRotateFile({
    dirname: logsDir,
    filename: 'rejection',
    extension: '.log',
    level: 'error',
    maxSize: '15mb',
    maxFiles: '14d',
  }),

  awsCloudWatchTransport,
  consoleTransport,
};
