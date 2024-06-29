import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as bodyParser from 'body-parser';
import * as winston from 'winston';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        new DailyRotateFile({
          filename: 'logs/%DATE%-error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
        new DailyRotateFile({
          filename: 'logs/%DATE%-combined.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info',
        }),
      ],
    })
  });

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.enableCors();
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  await app.listen(port);

  // console.log(`Application is running on port: ${port}`);
  logger.log(`Application is running on port: ${port}`);
  logger.log(`Application name: Belusys API`);
  console.log('running...')
}
bootstrap();
