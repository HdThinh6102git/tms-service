import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilePictureInputDto } from '../dtos';
import * as path from 'path';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { MESSAGES } from '../constants';

@Controller('picture')
export class UploadFileController {
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
          console.log(req);
        },
      }),
    }),
  )
  @Post('upload/local')
  async uploadPictureLocal(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return {
      error: false,
      data: {
        fileName: file.originalname,
      },
      message: MESSAGES.UPLOADED_SUCCEED,
      code: 0,
    };
  }

  @Get()
  getPicture(@Res() res: Response, @Body() file: FilePictureInputDto) {
    res.sendFile(path.join(__dirname, '../../../uploads/' + file.fileName));
  }
}
