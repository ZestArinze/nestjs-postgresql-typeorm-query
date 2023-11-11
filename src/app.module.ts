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

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    CitiesModule,
    ContinentsModule,
    CountriesModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
