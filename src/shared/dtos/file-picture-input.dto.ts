import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilePictureInputDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  fileName: string;
}
