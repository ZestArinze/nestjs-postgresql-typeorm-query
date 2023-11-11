import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { CitySeeder } from 'src/database/seeder/seeders/city.seeder';
import { ContinentSeeder } from 'src/database/seeder/seeders/continent.seeder';
import { CountrySeeder } from 'src/database/seeder/seeders/country.seeder';
import { EntityManager } from 'typeorm';

@Injectable()
export class SeederMiddleware implements NestMiddleware {
  private isSeedingComplete: Promise<boolean>;

  constructor(
    private readonly entityManager: EntityManager,
    readonly configService: ConfigService,
  ) { }

  async use(req: Request, res: Response, next: Function) {
    const runSeeders = this.configService.get<boolean>('RUN_DATABASE_SEEDERS', false);
    if (!runSeeders || (await this.isSeedingComplete)) {
      return next();
    }

    this.isSeedingComplete = (async () => {
      await new ContinentSeeder(this.entityManager).seed();
      await new CountrySeeder(this.entityManager).seed();
      await new CitySeeder(this.entityManager).seed();

      return true;
    })();

    await this.isSeedingComplete;

    next();
  }
}
