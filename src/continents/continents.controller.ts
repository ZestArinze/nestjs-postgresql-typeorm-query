import { Controller, Get } from '@nestjs/common';
import { ContinentsService } from './continents.service';

@Controller('continents')
export class ContinentsController {
  constructor(private readonly continentsService: ContinentsService) {}

  @Get()
  findAll() {
    return this.continentsService.findAll();
  }
}
