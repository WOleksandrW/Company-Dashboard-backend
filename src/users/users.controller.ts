import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, UseGuards, Req, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAllQueryDto } from './dto/get-all-query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ERole } from 'src/enums/role.enum';
import { getUserResponse, getAllResponse, updateUserResponse } from 'src/constants/swagger-constants';
import { SwaggerFileUploadDto } from 'src/dto/swagger-file.dto';

@ApiTags('Users Controller')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user.' })
  @ApiBody({ description: 'User object that needs to be created.', type: CreateUserDto })
  @ApiCreatedResponse({ description: 'The user has been successfully created.', schema: getUserResponse })
  create(
    @Req() req,
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Roles(ERole.ADMIN, ERole.SUPERADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users.' })
  @ApiQuery({ name: 'limit', description: 'Limit of users', required: false, example: 1 })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', required: false, example: 1 })
  @ApiQuery({ name: 'createdAt', description: 'Filter users by createdAt date', required: false, example: '2024-10-17' })
  @ApiQuery({ name: 'role', description: 'Filter users by role', required: false, example: ERole.USER })
  @ApiQuery({ name: 'search', description: 'Filter users by search value (username, email)', required: false })
  @ApiOkResponse({ description: 'The users has been successfully received.', schema: getAllResponse(getUserResponse) })  
  findAll(
    @Req() req,
    @Query(ValidationPipe) query: GetAllQueryDto
  ) {
    return this.usersService.findAll(query, req.user);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the current user.' })
  @ApiOkResponse({ description: 'The user has been successfully received.', schema: getUserResponse })
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the user.' })
  @ApiParam({ name: 'id', description: 'ID of the user to receive.', example: '1' })
  @ApiOkResponse({ description: 'The user has been successfully received.', schema: getUserResponse })
  findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update the user.' })
  @ApiParam({ name: 'id', description: 'ID of the user to update.', example: '1' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User object that needs to be updated.',
    schema: {
      type: 'object',
      allOf: [
        { $ref: getSchemaPath(UpdateUserDto) },
        { $ref: getSchemaPath(SwaggerFileUploadDto) }
      ],
    }
  })
  @ApiOkResponse({ description: 'The user has been successfully updated.', schema: updateUserResponse })
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.update(id, updateUserDto, req.user, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove the user.' })
  @ApiParam({ name: 'id', description: 'ID of the user to remove.', example: '1' })
  @ApiOkResponse({
    description: 'The user has been successfully removed.',
    schema: { example: { message: 'User has been successfully removed' } }
  })
  remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.remove(id, req.user);
  }
}
