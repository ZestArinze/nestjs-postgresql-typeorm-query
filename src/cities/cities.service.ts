import { Injectable } from '@nestjs/common';
import { Brackets, FindOptionsWhere, Repository } from 'typeorm';
import { City } from 'src/cities/entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindCitiesDto } from 'src/cities/dto/find-cities.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>) {
  }

  async findAll() {
    return await this.citiesRepository.find();
  }

  // FILTER & SEARCH - using Repository & Query Builder
  // ------------------------------------------
  // - filter results based on user input
  // - select related table columns
  // - search multiple columns based on user input
  // - select specific columns
  // - filter by columns in related table (parent or child table)
  // - search by columns in related table (parent or child table)



  async findMany(dto: FindCitiesDto) {
    const {
      name,
      timezone,
      active,
      countryId,
      continentName
    } = dto;

    const conditions: FindOptionsWhere<City> | FindOptionsWhere<City>[] = {
      ...(name ? { name } : {}),
      ...(timezone ? { timezone } : {}),
      ...('active' in dto ? { active } : {}),
      ...(countryId ? { countryId } : {}),
      ...(continentName ? { continent: { name: continentName } } : {}),
    };

    return await this.citiesRepository.find({
      where: conditions,
    });
  }



  async findManyUsingQueryBuilder(dto: FindCitiesDto) {
    const { search } = dto;

    const queryBuilder = this.citiesRepository.createQueryBuilder('city');

    if (search) {
      queryBuilder.andWhere(new Brackets(qb => {
        qb.where('LOWER(city.name) LIKE LOWER(:search)', { search: `%${search}%` })
          .orWhere('LOWER(city.timezone) LIKE LOWER(:search)', { search: `%${search}%` })
          .orWhere('LOWER(continent.name) LIKE LOWER(:search)', { search: `%${search}%` })
      }))
    }

    return queryBuilder
      .leftJoin('city.continent', 'continent')
      .select(['city', 'continent.name'])
      .getMany();
  }
}
