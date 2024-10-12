import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

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
  }

  async remove(id: number) {
    await this.imageRepository.delete({ id });
  }
}
