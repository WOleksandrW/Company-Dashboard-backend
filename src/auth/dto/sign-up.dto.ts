import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class SignUpDto extends OmitType(CreateUserDto, ['role']) {}
