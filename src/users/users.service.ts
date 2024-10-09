import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CompaniesService } from 'src/companies/companies.service';
import { userSelect } from 'src/constants/select-constants';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => CompaniesService)) private readonly companiesService: CompaniesService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    if (await this.checkIsExist({ email: rest.email })) {
      throw new ConflictException('Email is already in use.');
    }

    const hashPassword = await bcrypt.hash(password, this.saltRounds);

    return this.usersRepository.insert({ ...rest, password: hashPassword });
  }

  async findAll() {
    const list = await this.usersRepository
      .createQueryBuilder('user')
      .select(userSelect)
      .getMany();

    if (list.length === 0) {
      throw new NotFoundException('Users List Not Found');
    }

    return list;
  }

  async findOne(id: number) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(userSelect)
      .where('"user".id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  checkIsExist(where: FindOptionsWhere<User>) {
    return this.usersRepository.exists({ where, withDeleted: true });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const { password, ...rest } = updateUserDto;
    let body: { password?: string } = {};

    if (rest.email && user.email !== rest.email && await this.checkIsExist({ email: rest.email })) {
      throw new ConflictException('Email is already in use.');
    }

    if (password) {
      body.password = await bcrypt.hash(password, this.saltRounds);
    }

    return this.usersRepository.update(id, { ...rest, ...body });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.companiesService.removeByUser(id);

    return this.usersRepository.softDelete({ id });
  }
}
