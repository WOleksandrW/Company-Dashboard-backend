import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private readonly companiesRepository: Repository<Company>,
    private readonly usersService: UsersService
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { userId, ...rest } = createCompanyDto;

    const user = await this.usersService.findOne(userId);

    return this.companiesRepository.insert({ ...rest, user });
  }

  findAll() {
    return this.companiesRepository.find({
      relations: { user: true }
    });
  }

  findOne(id: number) {
    return this.companiesRepository.findOne({
      where: { id },
      relations: { user: true }
    });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const { userId, ...rest } = updateCompanyDto;
    let body: { user?: User } = {};

    if (userId) {
      body.user = await this.usersService.findOne(userId);
    }

    return this.companiesRepository.update(id, { ...rest, ...body });
  }

  remove(id: number) {
    return this.companiesRepository.softDelete({ id });
  }
}
