import { Injectable, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileUploadInterceptor {
  static uploadFile(
    fieldName: string,
    allowedTypes: string[] = [],
    destination = 'uploads',
  ) {
    return FileInterceptor(fieldName, {
      storage: diskStorage({
        destination,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type!'), false);
        }
        cb(null, true);
      },
    });
  }
}
