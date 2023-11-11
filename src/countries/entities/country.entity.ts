import { City } from "src/cities/entities/city.entity";
import { Continent } from "src/continents/entities/continent.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'countries' })
export class Country {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@Column({ name: 'continent_id' })
	continentId: number;

	@ManyToOne(() => Continent, (continent) => continent.countries, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'continent_id' })
	continent: Continent;

	@OneToMany(() => City, (city) => city.country)
	countries: City[];
}
