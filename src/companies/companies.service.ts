import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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

    if (await this.checkIsExist({ title: rest.title })) {
      throw new ConflictException('Title is already in use.');
    }

    const user = await this.usersService.findOne(userId);

    return this.companiesRepository.insert({ ...rest, user });
  }

  async findAll() {
    const list = await this.companiesRepository.find({
      relations: { user: true }
    });

    if (list.length === 0) {
      throw new NotFoundException('Companies List Not Found');
    }

    return list;
  }

  async findOne(id: number) {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!company) {
      throw new NotFoundException('Company Not Found');
    }

    return company;
  }

  checkIsExist(where: FindOptionsWhere<Company>) {
    return this.companiesRepository.exists({ where, withDeleted: true });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);

    const { userId, ...rest } = updateCompanyDto;
    let body: { user?: User } = {};

    if (rest.title && company.title !== rest.title && await this.checkIsExist({ title: rest.title })) {
      throw new ConflictException('Title is already in use.');
    }

    if (userId) {
      body.user = await this.usersService.findOne(userId);
    }

    return this.companiesRepository.update(id, { ...rest, ...body });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.companiesRepository.softDelete({ id });
  }
}
