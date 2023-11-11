import { EntityManager } from 'typeorm';
import { Seeder } from '../seeder.interface';
import { City } from 'src/cities/entities/city.entity';
import { citiesData } from 'src/database/seeder/seeders/faker/data';
import { Continent } from 'src/continents/entities/continent.entity';
import { getUniqueListOfObjectsByKey, randomItem } from 'src/shared/utils/iterable.utils';
import { Country } from 'src/countries/entities/country.entity';

export class CitySeeder implements Seeder {
  constructor(private readonly entityManager: EntityManager,) { }

  async seedData(): Promise<Array<Partial<City>>> {
    if (await this.entityManager.count(City) > 0) {
      return [];
    }

    const uniqueList = getUniqueListOfObjectsByKey('name', citiesData);
    const result: Array<Partial<City>> = [];

    for (const city of uniqueList) {
      const continent = await this.entityManager.findOne(Continent, { where: { name: city.continent }});
      if (!continent) {
        continue;
      }

      const country = await this.entityManager.findOne(Country, { where: { name: city.country }});
      if (!country) {
        continue;
      }

      result.push({
        name: city.name,
        active: randomItem([true, false]),
        timezone: city.timezone,
        countryId: country.id,
        continentId: continent.id,
      });
    }

    return result;
  }

  async seed() {
    await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(City, await this.seedData(), {
          chunk: 100,
        });
      },
    );
  }
}
