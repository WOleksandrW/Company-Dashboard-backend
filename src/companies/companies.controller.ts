import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, UseGuards, Query, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { GetAllQueryDto } from './dto/get-all-query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body(ValidationPipe) createCompanyDto: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.companiesService.create(createCompanyDto, file);
  }

  @Get()
  findAll(@Req() req, @Query(ValidationPipe) query: GetAllQueryDto) {
    return this.companiesService.findAll(query, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.companiesService.update(id, updateCompanyDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.remove(id);
  }
}
