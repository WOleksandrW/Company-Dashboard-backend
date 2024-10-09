import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { CompaniesModule } from './companies/companies.module';
import { Company } from './companies/entities/company.entity';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      entities: [User, Company],
      database: 'companyAppDB',
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    CompaniesModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy
  ],
})
export class AppModule {}
