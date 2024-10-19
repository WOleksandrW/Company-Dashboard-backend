import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, UseGuards, Req, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAllQueryDto } from './dto/get-all-query.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ERole } from 'src/enums/ERole';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Req() req,
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ) {
    return this.usersService.create(createUserDto, req.user.id);
  }

  @Roles(ERole.ADMIN, ERole.SUPERADMIN)
  @Get()
  findAll(
    @Req() req,
    @Query(ValidationPipe) query: GetAllQueryDto
  ) {
    return this.usersService.findAll(query, req.user.id);
  }

  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  findOne(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.update(id, updateUserDto, req.user.id, file);
  }

  @Delete(':id')
  remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.remove(id, req.user.id);
  }
}
