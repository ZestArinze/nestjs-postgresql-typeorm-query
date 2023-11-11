import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>) {
  }

  async findAll() {
    return await this.countriesRepository.find();
  }
}
