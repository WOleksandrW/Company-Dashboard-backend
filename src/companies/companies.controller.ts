import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, UseGuards, Query, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { GetAllQueryDto } from './dto/get-all-query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { EOrder } from 'src/enums/order.enum';
import { getCompanyResponse, getAllResponse, updateCompanyResponse } from 'src/constants/swagger-constants';

@ApiTags('Companies Controller')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a company.' })
  @ApiBody({ description: 'Company object that needs to be created.', type: CreateCompanyDto })
  @ApiCreatedResponse({ description: 'The company has been successfully created.', schema: getCompanyResponse })
  create(
    @Req() req,
    @Body(ValidationPipe) createCompanyDto: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.companiesService.create(createCompanyDto, req.user.id, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies.' })
  @ApiQuery({ name: 'user', description: 'Filter companies by user', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Limit of companies', required: false, example: 1 })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', required: false, example: 1 })
  @ApiQuery({ name: 'titleOrder', description: 'Order companies by title', required: false, example: EOrder.ASC })
  @ApiQuery({ name: 'serviceOrder', description: 'Order companies by service', required: false, example: EOrder.ASC })
  @ApiQuery({ name: 'createdAt', description: 'Filter companies by createdAt date', required: false, example: '2024-10-17' })
  @ApiQuery({ name: 'capitalMin', description: 'Filter companies by minimal capital', required: false, example: 124 })
  @ApiQuery({ name: 'capitalMax', description: 'Filter companies by maximal capital', required: false, example: 1754 })
  @ApiQuery({ name: 'search', description: 'Filter companies by search value (title)', required: false })
  @ApiOkResponse({ description: 'The companies has been successfully received.', schema: getAllResponse(getCompanyResponse) })
  findAll(
    @Req() req,
    @Query(ValidationPipe) query: GetAllQueryDto
  ) {
    return this.companiesService.findAll(query, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the company.' })
  @ApiParam({ name: 'id', description: 'ID of the company to receive.', example: '1' })
  @ApiOkResponse({ description: 'The company has been successfully received.', schema: getCompanyResponse })
  findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.companiesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update the company.' })
  @ApiParam({ name: 'id', description: 'ID of the company to update.', example: '1' })
  @ApiBody({ description: 'Company object that needs to be updated.', type: UpdateCompanyDto })
  @ApiOkResponse({ description: 'The company has been successfully updated.', schema: updateCompanyResponse })
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
  @ApiParam({ name: 'id', description: 'ID of the company to remove.', example: '1' })
  @ApiOkResponse({
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
