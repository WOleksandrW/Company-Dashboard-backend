import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, UseGuards, Query, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { GetAllQueryDto } from './dto/get-all-query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { EOrder } from 'src/enums/order.enum';
import { companySwaggerEntity, companySwaggerPatch, companySwaggerPost, InfiniteToken, userSwaggerPatch } from 'src/constants/swagger-constants';

@ApiTags('Companies Controller')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a company.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiBody({
    description: 'Company object that needs to be created.',
    schema: { example: { ...companySwaggerPost, userId: companySwaggerEntity.id } }
  })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    schema: { example: companySwaggerEntity }
  })
  create(
    @Req() req,
    @Body(ValidationPipe) createCompanyDto: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.companiesService.create(createCompanyDto, req.user.id, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiQuery({
    name: 'user',
    description: 'Filter companies by user',
    required: false,
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit of companies',
    required: false,
    example: 1
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    example: 1
  })
  @ApiQuery({
    name: 'titleOrder',
    description: 'Order companies by title',
    required: false,
    example: EOrder.ASC
  })
  @ApiQuery({
    name: 'serviceOrder',
    description: 'Order companies by service',
    required: false,
    example: EOrder.ASC
  })
  @ApiQuery({
    name: 'createdAt',
    description: 'Filter companies by createdAt date',
    required: false,
    example: '2024-10-17'
  })
  @ApiQuery({
    name: 'capitalMin',
    description: 'Filter companies by minimal capital',
    required: false,
    example: 124
  })
  @ApiQuery({
    name: 'capitalMax',
    description: 'Filter companies by maximal capital',
    required: false,
    example: 1754
  })
  @ApiQuery({
    name: 'search',
    description: 'Filter companies by search value (title)',
    required: false,
    example: 'example'
  })
  @ApiResponse({
    status: 200,
    description: 'The companies has been successfully received.',
    schema: { example: [companySwaggerEntity] }
  })
  findAll(
    @Req() req,
    @Query(ValidationPipe) query: GetAllQueryDto
  ) {
    return this.companiesService.findAll(query, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the company.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the company to receive.',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully received.',
    schema: { example: companySwaggerEntity }
  })
  findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.companiesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update the company.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the company to update.',
    example: '1'
  })
  @ApiBody({
    description: 'Company object that needs to be updated.',
    schema: { example: { ...companySwaggerPatch, userId: 150 } }
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated.',
    schema: { example: { ...companySwaggerEntity, ...companySwaggerPatch, updatedAt: '2024-10-03T14:59:18.438Z', user: { ...companySwaggerEntity.user, ...userSwaggerPatch, id: 150 } } }
  })
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.companiesService.update(id, updateCompanyDto, req.user.id, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove the company.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the company to remove.',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully removed.',
    schema: { example: { message: 'Company has been successfully removed' } }
  })
  remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.companiesService.remove(id, req.user.id);
  }
}
