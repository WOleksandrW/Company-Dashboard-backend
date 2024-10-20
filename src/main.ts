import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CreateCompanyDto } from './companies/dto/create-company.dto';
import { UpdateCompanyDto } from './companies/dto/update-company.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';
import { SwaggerFileUploadDto } from './dto/swagger-file.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Company Dashboard App API')
    .setDescription('The company dashboard app API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      'Authorization'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [CreateCompanyDto, UpdateCompanyDto, CreateUserDto, UpdateUserDto, SwaggerFileUploadDto]
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
