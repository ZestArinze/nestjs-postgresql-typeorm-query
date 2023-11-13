import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CitiesModule } from './cities/cities.module';
import { ContinentsModule } from './continents/continents.module';
import { CountriesModule } from './countries/countries.module';
import { SeederModule } from 'src/database/seeder/seeder.module';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { loggerTransports } from 'src/config/logger.config';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // do NOT use synchronize: true in real projects
        // migration is outside the scope of this tutorial
        synchronize: true,
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],

        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
      }),
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const consoleDebug = +configService.get<number>('APP_DEBUG', 0) === 1;

        const transports = [
          loggerTransports.combinedFile,
          loggerTransports.errorFile,
        ];

        const logger = {
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json(),
          ),
          transports: consoleDebug
            ? [
                ...transports,
                new winston.transports.Console({
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
                    // winston.format.printf((info) => {
                    //   return `${info.timestamp} [${info.level}] [${
                    //     info.context ? info.context : info.stack
                    //   }] ${info.message}`;
                    // }),
                    // winston.format.align(),
                  ),
                }),
              ]
            : transports,
          exceptionHandlers: [loggerTransports.exceptionFile],
          rejectionHandlers: [loggerTransports.rejectionFile],
        };

        return logger;
      },
      inject: [ConfigService],
    }),
    CitiesModule,
    ContinentsModule,
    CountriesModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
