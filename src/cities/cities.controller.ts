import { Controller, Get, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { FindCitiesDto } from 'src/cities/dto/find-cities.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll(@Query() query: FindCitiesDto) {
    return this.citiesService.findManyUsingQueryBuilder(query);
  }
}
