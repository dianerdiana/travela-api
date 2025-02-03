// NestJs
import { Injectable, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Thirdparty
import { memoryStorage } from 'multer';

@Injectable()
export class FileUploadInterceptor {
  constructor() {}

  static uploadFile(fieldName: string, allowedTypes: string[] = []) {
    return FileInterceptor(fieldName, {
      storage: memoryStorage(), // Simpan di buffer agar bisa dikirim ke ImageKit
      fileFilter: (req, file, cb) => {
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type!'), false);
        }
        cb(null, true);
      },
    } as MulterOptions);
  }
}
