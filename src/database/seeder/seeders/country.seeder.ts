import { EntityManager } from 'typeorm';
import { Seeder } from '../seeder.interface';
import { Country } from 'src/countries/entities/country.entity';
import { CityData, citiesData } from 'src/database/seeder/seeders/faker/data';
import { Continent } from 'src/continents/entities/continent.entity';
import { getUniqueListOfObjectsByKey } from 'src/shared/utils/iterable.utils';

export class CountrySeeder implements Seeder {
  constructor(private readonly entityManager: EntityManager,) { }

  async seedData(): Promise<Array<Partial<Country>>> {
    if(await this.entityManager.count(Country) > 0) {
      return [];
    }

    const uniqueList = getUniqueListOfObjectsByKey<CityData>('country', citiesData);
    const result: Array<Partial<Country>> = [];

    for (const city of uniqueList) {
      const continent = await this.entityManager.findOne(Continent, { where: { name: city.continent }});
      if (!continent) {
        continue;
      }

      result.push({ 
        name: city.country,
        continentId: continent.id,
      });
    }

    return result;
  }

  async seed() {
    await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(Country, await this.seedData(), {
          chunk: 100,
        });
      },
    );
  }
}
