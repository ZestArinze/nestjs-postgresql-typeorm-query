import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Continent } from 'src/continents/entities/continent.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContinentsService {
  constructor(
    @InjectRepository(Continent)
    private readonly continentsRepository: Repository<Continent>) {
  }

  async findAll() {
    return await this.continentsRepository.find({
      relations: {
        cities: true,
        countries: true,
      },
      select: {
        id: true,
        name: true,
        cities: {
          id: true,
          name: true,
        },
        countries: {
          id: true,
          name: true,
        }
      }
    });
  }
}
