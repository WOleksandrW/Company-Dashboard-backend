import { BadRequestException, ConflictException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { ERole } from 'src/enums/role.enum';
import { errorCatcher } from 'src/helpers/errorCatcher';
import { EXCEPTION_TAG } from 'src/constants/error-constants';

const isForbiddenAccess = (activeRole: string, targetRole: string) => (
  (activeRole === ERole.USER) ||
  (activeRole === ERole.ADMIN && targetRole !== ERole.USER) ||
  (activeRole === ERole.SUPERADMIN && targetRole === ERole.SUPERADMIN)
);

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => CompaniesService)) private readonly companiesService: CompaniesService,
    private readonly imagesService: ImagesService
  ) {}

  async create(createUserDto: CreateUserDto, activeUser?: User) {
    const { password, ...rest } = createUserDto;

    try {
      // Check access by role
      if (activeUser && isForbiddenAccess(activeUser.role, rest.role)) {
        throw new ForbiddenException('You don`t have enough rights', { description: EXCEPTION_TAG });
      }

      const isEmailInUse = await this.checkIsExist({ email: rest.email });
      if (isEmailInUse) {
        throw new ConflictException('Email is already in use.', { description: EXCEPTION_TAG });
      }

      const isUsernameInUse = await this.checkIsExist({ username: rest.username });
      if (isUsernameInUse) {
        throw new ConflictException('Username is already in use.', { description: EXCEPTION_TAG });
      }

      const hashPassword = await bcrypt.hash(password, this.saltRounds);

      const created = await this.usersRepository.save({ ...rest, password: hashPassword });
      return this.findOne(created.id);
    } catch (error) {
      errorCatcher(error, 'Create user error', EXCEPTION_TAG);
    }
  }

  async findAll({ limit, page, createdAt, role, search }: GetAllQueryDto, activeUser: User) {
    try {
      const query = this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.image', 'image')
        .select([...userSelect, 'image']);

      // Check access by role
      switch (activeUser.role) {
        case ERole.ADMIN:
          query.andWhere('"user".role = :activeRole', { activeRole: ERole.USER });
          break;
        case ERole.SUPERADMIN:
          query.andWhere('"user".role != :activeRole', { activeRole: ERole.SUPERADMIN });
          break;
        default:
          throw new ForbiddenException('Access Denied', { description: EXCEPTION_TAG });
      }

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
    } catch (error) {
      errorCatcher(error, 'Find all users error', EXCEPTION_TAG);
    }
  }

  async findOne(id: number, activeUser?: User) {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.image', 'image')
        .select([...userSelect, 'image'])
        .where('"user".id = :id', { id })
        .getOne();

      if (!user) {
        throw new NotFoundException('User Not Found', { description: EXCEPTION_TAG });
      }

      // Check access by role
      if (activeUser && activeUser.id !== id && isForbiddenAccess(activeUser.role, user.role)) {
        throw new NotFoundException('User Not Found', { description: EXCEPTION_TAG });
      }

      return user;
    } catch (error) {
      errorCatcher(error, 'Find one user error', EXCEPTION_TAG);
    }
  }

  findOneBy(where: FindOptionsWhere<User>) {
    return this.usersRepository.findOneBy(where);
  }

  checkIsExist(where: FindOptionsWhere<User>) {
    return this.usersRepository.exists({ where, withDeleted: true });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    activeUser: User,
    file?: Express.Multer.File
  ) {
    try {
      const user = await this.usersRepository.findOne({ where: { id }, relations: { image: true } });
      if (!user) {
        throw new NotFoundException('User Not Found', { description: EXCEPTION_TAG });
      }

      // Check access by role
      if (id !== activeUser.id && isForbiddenAccess(activeUser.role, user.role)) {
        throw new NotFoundException('User Not Found', { description: EXCEPTION_TAG });
      }

      const { password, oldPassword, deleteFile, role, ...rest } = updateUserDto;
      let body: { password?: string, image?: Image } = {};

      if (role) {
        throw new ConflictException('There is no way to change the user`s role.', { description: EXCEPTION_TAG });
      }

      const isEmailChanged = rest.email && user.email !== rest.email;
      const isEmailInUse = isEmailChanged && await this.checkIsExist({ email: rest.email });
      if (isEmailInUse) {
        throw new ConflictException('Email is already in use.', { description: EXCEPTION_TAG });
      }

      const isUsernameChanged = rest.username && user.username !== rest.username;
      const isUsernameInUse = isUsernameChanged && await this.checkIsExist({ username: rest.username })
      if (isUsernameInUse) {
        throw new ConflictException('Username is already in use.', { description: EXCEPTION_TAG });
      }

      if (password) {
        const isSameUser = activeUser.id === id;
        const isOldPasswordValid = await bcrypt.compare(oldPassword ?? '', user.password);
        if (isSameUser && !isOldPasswordValid) {
          throw new BadRequestException('Invalid password', { description: EXCEPTION_TAG });
        }
        body.password = await bcrypt.hash(password, this.saltRounds);
      }

      if (file) {
        if (user.image) {
          await this.imagesService.replaceImage(user.image.id, file)
        } else {
          body.image = await this.imagesService.uploadImage(file);
        }
      } else if (!!deleteFile && JSON.parse(deleteFile as string) && user.image) {
        await this.imagesService.remove(user.image.id);
      }

      await this.usersRepository.update(id, { ...rest, ...body });
      return this.findOne(id);
    } catch (error) {
      errorCatcher(error, 'Update user error', EXCEPTION_TAG);
    }
  }

  async resetPassword(email: string, password: string) {
    try {
      const user = await this.findOneBy({ email });
      if (!user) {
        throw new NotFoundException('User not found', { description: EXCEPTION_TAG });
      }

      const hash = await bcrypt.hash(password, this.saltRounds);
      await this.usersRepository.update(user.id, { password: hash });
      return true;
    } catch (error) {
      errorCatcher(error, 'Reset password error', EXCEPTION_TAG);
    }
  }

  async remove(id: number, activeUser: User) {
    try {
      const user = await this.findOne(id);

      // Check access by role
      if (id !== activeUser.id && isForbiddenAccess(activeUser.role, user.role)) {
        throw new NotFoundException('User Not Found', { description: EXCEPTION_TAG });
      }

      await this.companiesService.removeByUser(id);

      if (user.image) {
        await this.imagesService.remove(user.image.id);
      }

      await this.usersRepository.softDelete({ id });

      return {
        message: 'User has been successfully removed'
      };
    } catch (error) {
      errorCatcher(error, 'Remove user error', EXCEPTION_TAG);
    }
  }
}
