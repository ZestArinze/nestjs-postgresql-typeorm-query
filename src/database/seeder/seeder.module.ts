import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SeederMiddleware } from './seeder.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule]
})
export class SeederModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SeederMiddleware).forRoutes('*');
  }
}
