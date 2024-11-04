import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Company } from './companies/entities/company.entity';
import { Image } from './images/entities/image.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.NODE_ENV === 'docker' ? 'db' : 'localhost',
  port: 5432,
  password: 'postgres',
  username: 'postgres',
  entities: [User, Company, Image],
  database: process.env.NODE_ENV === 'docker' ? 'postgres' : 'companyAppDB',
  logging: true,
  synchronize: false,
  migrations: ["src/migration/**/*.ts"]
});
