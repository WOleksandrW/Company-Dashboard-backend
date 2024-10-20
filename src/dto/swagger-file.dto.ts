import { ApiPropertyOptional } from "@nestjs/swagger";

export class SwaggerFileUploadDto {
  @ApiPropertyOptional({
    description: 'File field.',
    type: 'string',
    format: 'binary'
  })
  file?: string;
}
