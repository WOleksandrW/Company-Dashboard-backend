import { ConflictException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { GetAllQueryDto } from './dto/get-all-query.dto';
import { Company } from './entities/company.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { EOrder } from 'src/enums/order.enum';
import { userSelect } from 'src/constants/select-constants';
import { Image } from 'src/images/entities/image.entity';
import { ImagesService } from 'src/images/images.service';
import { ERole } from 'src/enums/role.enum';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private readonly companiesRepository: Repository<Company>,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    private readonly imagesService: ImagesService
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    activeUser: User,
    file?: Express.Multer.File
  ) {
    const { userId, ...rest } = createCompanyDto;

    let body: { image?: Image, user?: User } = {};

    if (await this.checkIsExist({ title: rest.title })) {
      throw new ConflictException('Title is already in use.');
    }

    // Check access by role
    if (activeUser.role === ERole.USER) {
      body.user = activeUser;
    } else {
      body.user = await this.usersService.findOne(userId);
      if (body.user.role !== ERole.USER) {
        throw new ForbiddenException('Only user can have companies.');
      }
    }

    if (file) {
      body.image = await this.imagesService.uploadImage(file);
    }

    const created = await this.companiesRepository.save({ ...rest, ...body });
    return this.findOne(created.id);
  }

  async findAll({
    user,
    limit,
    page,
    titleOrder,
    serviceOrder,
    createdAt,
    capitalMin,
    capitalMax,
    search
  }: GetAllQueryDto, activeUser: User) {
    const query = this.companiesRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user')
      .leftJoinAndSelect('company.image', 'imageCompany')
      .leftJoinAndSelect('user.image', 'imageUser')
      .select(['company', ...userSelect, 'imageCompany', 'imageUser']);

    // Filter by Company.user
    if (activeUser.role === ERole.USER) {
      query.andWhere('company.user = :user', { user: activeUser.id });
    } else if (+user) {
      query.andWhere('company.user = :user', { user: +user });
    }

    // Filter by Date
    if (createdAt) {
      query.andWhere(`TO_CHAR(company.createdAt, 'YYYY-MM-DD') LIKE :createdAt`, { createdAt: `${createdAt}%` });
    }

    // Filter by Capital
    if (capitalMin) {
      query.andWhere('company.capital >= :capitalMin', { capitalMin });
    }
    if (capitalMax) {
      query.andWhere('company.capital <= :capitalMax', { capitalMax });
    }

    // Filter by Search
    if (search) {
      query.andWhere('company.title ILIKE :value', { value: `%${search}%` });
    }

    // Order
    const orderConfig: { [key: string]: EOrder } = {};

    if (titleOrder) {
      orderConfig['company.title'] = titleOrder;
    }
    if (serviceOrder) {
      orderConfig['company.service'] = serviceOrder;
    }

    query.orderBy(orderConfig);

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

  async findOne(id: number, activeUser?: User) {
    const company = await this.companiesRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user')
      .leftJoinAndSelect('company.image', 'imageCompany')
      .leftJoinAndSelect('user.image', 'imageUser')
      .select(['company', ...userSelect, 'imageCompany', 'imageUser'])
      .where('"company".id = :id', { id })
      .getOne();

    if (!company) {
      throw new NotFoundException('Company Not Found');
    }

    // Check access by role
    if (activeUser && activeUser.id !== company.user.id && activeUser.role === ERole.USER) {
      throw new NotFoundException('Company Not Found');
    }

    return company;
  }

  checkIsExist(where: FindOptionsWhere<Company>) {
    return this.companiesRepository.exists({ where, withDeleted: true });
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    activeUser: User,
    file?: Express.Multer.File
  ) {
    const company = await this.findOne(id);

    // Check access by role
    if (activeUser.id !== company.user.id && activeUser.role === ERole.USER) {
      throw new NotFoundException('Company Not Found');
    }

    const { userId, deleteFile, ...rest } = updateCompanyDto;
    let body: { user?: User, image?: Image } = {};

    if (rest.title && company.title !== rest.title && await this.checkIsExist({ title: rest.title })) {
      throw new ConflictException('Title is already in use.');
    }

    if (userId) {
      body.user = await this.usersService.findOne(userId);
      if (body.user.role !== ERole.USER) {
        throw new ForbiddenException('Only user can have companies.');
      }
    }

    if (file) {
      if (company.image) {
        await this.imagesService.replaceImage(company.image.id, file)
      } else {
        body.image = await this.imagesService.uploadImage(file);
      }
    } else if ((deleteFile === 'true' || deleteFile === true) && company.image) {
      await this.imagesService.remove(company.image.id);
    }

    await this.companiesRepository.update(id, { ...rest, ...body });
    return this.findOne(id);
  }

  async remove(id: number, activeUser: User) {
    const company = await this.findOne(id);

    // Check access by role
    if (activeUser.id !== company.user.id && activeUser.role === ERole.USER) {
      throw new NotFoundException('Company Not Found');
    }

    if (company.image) {
      await this.imagesService.remove(company.image.id);
    }

    await this.companiesRepository.softDelete({ id });

    return {
      message: 'Company has been successfully removed'
    };
  }

  async removeByUser(id: number) {
    const companies = await this.companiesRepository.find({
      where: { user: { id } },
      relations: ['image']
    });

    for (const company of companies) {
      if (company.image) {
        await this.imagesService.remove(company.image.id);
      }
    }

    await this.companiesRepository.softDelete({ user: { id } });

    return {
      message: 'Companies have been successfully removed'
    };
  }
}
