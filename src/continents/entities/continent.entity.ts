import { City } from "src/cities/entities/city.entity";
import { Country } from "src/countries/entities/country.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'continents' })
export class Continent {
	@PrimaryGeneratedColumn()
	id: number;
  
	@Column({ unique: true })
	name: string;

	@OneToMany(() => Country, (country) => country.continent)
	countries: Country[];

	@OneToMany(() => City, (city) => city.continent)
	cities: City[];
}
