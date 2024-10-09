import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image) private readonly imageRepository: Repository<Image>
  ) {}

  async uploadImage(file: Express.Multer.File) {
    return this.imageRepository.save({ data: file.buffer, mimeType: file.mimetype });
  }

  async replaceImage(id: number, file: Express.Multer.File) {
    await this.imageRepository.update(id, { data: file.buffer, mimeType: file.mimetype });
    return this.findOne(id);
  }

  async findOne(id: number) {
    const image = await this.imageRepository.findOneBy({ id });

    if (!image) {
      throw new NotFoundException('Image Not Found');
    }

    return image;
  }

  async update(id: number, data: { company?: Company; user?: User }) {
    await this.imageRepository.update(id, data);
    return this.findOne(id);
  }
}
