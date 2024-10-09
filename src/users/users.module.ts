import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CompaniesModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
