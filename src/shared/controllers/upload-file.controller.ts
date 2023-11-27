import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from '../../auth/guards';
import { AssignmentService } from '../../assignment/providers';

@Controller('')
export class UploadFileController {
  constructor(private readonly assignmentService: AssignmentService) {}
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/assignment',
        filename: (req, file, cb) => {
          const randomFileName = `${Date.now()}-${file.originalname}`;
          cb(null, randomFileName);
          console.log(req.baseUrl);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const allowedExtArr = ['.pdf', '.docx', '.zip', '.rar', '.pptx'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size is less than 5 MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post('upload/assignment/:id')
  async uploadUserProfilePicture(
    @Req() req: any,
    @UploadedFile()
    file: Express.Multer.File,
    @Param('id') assignmentId: string,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return await this.assignmentService.updateResultFile(
      `assignment/${file.filename}`,
      assignmentId,
    );
  }
}
