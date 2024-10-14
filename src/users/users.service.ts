import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAllQueryDto } from './dto/get-all-query.dto';
import { User } from './entities/user.entity';
import { CompaniesService } from 'src/companies/companies.service';
import { userSelect } from 'src/constants/select-constants';
import { Image } from 'src/images/entities/image.entity';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => CompaniesService)) private readonly companiesService: CompaniesService,
    private readonly imagesService: ImagesService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    if (await this.checkIsExist({ email: rest.email })) {
      throw new ConflictException('Email is already in use.');
    }

    const hashPassword = await bcrypt.hash(password, this.saltRounds);

    const created = await this.usersRepository.save({ ...rest, password: hashPassword });
    return this.findOne(created.id);
  }

  async findAll({ limit, page, createdAt, role, search }: GetAllQueryDto) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.image', 'image')
      .select([...userSelect, 'image']);

    // Filter by Role
    if (role) {
      query.andWhere('"user".role = :role', { role });
    }

    // Filter by Date
    if (createdAt) {
      query.andWhere(`TO_CHAR("user"."createdAt", 'YYYY-MM-DD') LIKE :createdAt`, { createdAt: `${createdAt}%` });
    }

    // Filter by Search
    if (search) {
      query.andWhere('("user".username ILIKE :value OR "user".email ILIKE :value)', {
        value: `%${search}%`
      });
    }

    const totalAmount = await query.getCount();

    // Pagination
    if (+limit) {
      query.limit(+limit);

      if (+page) {
        query.offset(+limit * (+page - 1));
      }
    }

    const list = await query.getMany();

    return { 
      list,
      totalAmount,
      limit: +limit,
      page: +page
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.image', 'image')
    .select([...userSelect, 'image'])
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

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File
  ) {
    const user = await this.findOne(id);

    const { password, file: fileCommand, ...rest } = updateUserDto;
    let body: { password?: string, image?: Image } = {};

    if (rest.email && user.email !== rest.email && await this.checkIsExist({ email: rest.email })) {
      throw new ConflictException('Email is already in use.');
    }

    if (password) {
      body.password = await bcrypt.hash(password, this.saltRounds);
    }

    if (file) {
      if (user.image) {
        await this.imagesService.replaceImage(user.image.id, file)
      } else {
        body.image = await this.imagesService.uploadImage(file);
      }
    } else if ((fileCommand === null || fileCommand === 'null') && user.image) {
      await this.imagesService.remove(user.image.id);
    }

    await this.usersRepository.update(id, { ...rest, ...body });
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    await this.companiesService.removeByUser(id);

    if (user.image) {
      await this.imagesService.remove(user.image.id);
    }

    await this.usersRepository.softDelete({ id });

    return {
      message: 'User has been successfully removed'
    };
  }
}
