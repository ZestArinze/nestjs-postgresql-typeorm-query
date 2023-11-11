import { Continent } from 'src/continents/entities/continent.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column()
  timezone: string;

  @Column({ name: 'continent_id' })
  continentId: number;

  @Column({ name: 'country_id' })
  countryId: number;

  @ManyToOne(() => Continent, (continent) => continent.countries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'continent_id' })
  continent: Continent;

  @ManyToOne(() => Country, (country) => country.countries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
