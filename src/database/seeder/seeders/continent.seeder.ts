import { EntityManager } from 'typeorm';
import { Seeder } from '../seeder.interface';
import { Continent } from 'src/continents/entities/continent.entity';
import { citiesData } from 'src/database/seeder/seeders/faker/data';
import { getUniqueListOfObjectsByKey } from 'src/shared/utils/iterable.utils';

export class ContinentSeeder implements Seeder {
  constructor(private readonly entityManager: EntityManager,) { }

  async seedData(): Promise<Array<Partial<Continent>>> {
    if(await this.entityManager.count(Continent) > 0) {
      return [];
    }

    const uniqueList = getUniqueListOfObjectsByKey('continent', citiesData);
    const result: Array<Partial<Continent>> = [];

    for (const city of uniqueList) {
      result.push({ name: city.continent, });
    }

    return result;
  }

  async seed() {
    await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(Continent, await this.seedData(), {
          chunk: 100,
        });
      },
    );
  }
}
