import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, UseGuards, Req, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAllQueryDto } from './dto/get-all-query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ERole } from 'src/enums/role.enum';
import { InfiniteToken, userSwaggerEntity, userSwaggerPatch, userSwaggerPost } from 'src/constants/swagger-constants';

@ApiTags('Users Controller')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiBody({
    description: 'User object that needs to be created.',
    schema: { example: { ...userSwaggerPost, password: 'asd@3ASD' } }
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: { example: userSwaggerEntity }
  })
  create(
    @Req() req,
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ) {
    return this.usersService.create(createUserDto, req.user.id);
  }

  @Roles(ERole.ADMIN, ERole.SUPERADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit of users',
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
    name: 'createdAt',
    description: 'Filter users by createdAt date',
    required: false,
    example: '2024-10-17'
  })
  @ApiQuery({
    name: 'role',
    description: 'Filter users by role',
    required: false,
    example: ERole.USER
  })
  @ApiQuery({
    name: 'search',
    description: 'Filter users by search value (username, email)',
    required: false,
    example: 'example'
  })
  @ApiResponse({
    status: 200,
    description: 'The users has been successfully received.',
    schema: { example: [userSwaggerEntity] }
  })  
  findAll(
    @Req() req,
    @Query(ValidationPipe) query: GetAllQueryDto
  ) {
    return this.usersService.findAll(query, req.user.id);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the current user.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully received.',
    schema: { example: userSwaggerEntity }
  })
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the user.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to receive.',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully received.',
    schema: { example: userSwaggerEntity }
  })
  findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update the user.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to update.',
    example: '1'
  })
  @ApiBody({
    description: 'User object that needs to be updated.',
    schema: { example: { ...userSwaggerPatch, password: 'example-password' } }
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    schema: { example: { ...userSwaggerEntity, ...userSwaggerPatch, updatedAt: '2024-10-03T14:30:46.174Z' } }
  })
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.update(id, updateUserDto, req.user.id, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove the user.' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization token',
    required: true,
    schema: { example: `Bearer ${InfiniteToken}` }
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to remove.',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully removed.',
    schema: { example: { message: 'User has been successfully removed' } }
  })
  remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.remove(id, req.user.id);
  }
}
