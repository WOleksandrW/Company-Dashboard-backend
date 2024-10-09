import { forwardRef, Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    forwardRef(() => UsersModule)
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService]
})
export class CompaniesModule {}
