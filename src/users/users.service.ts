import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    const hashPassword = await bcrypt.hash(password, this.saltRounds);

    return this.usersRepository.insert({ ...rest, password: hashPassword });
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    let body: { password?: string } = {};

    if (password) {
      body.password = await bcrypt.hash(password, this.saltRounds);
    }

    return this.usersRepository.update(id, { ...rest, ...body });
  }

  remove(id: number) {
    return this.usersRepository.softDelete({ id });
  }
}
