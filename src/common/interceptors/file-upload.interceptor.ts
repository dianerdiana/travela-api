// NestJs
import { Injectable, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Thirdparty
import { memoryStorage } from 'multer';
import { LangService } from '@lib/i18n/lang.service';

@Injectable()
export class FileUploadInterceptor {
  constructor(private readonly langService: LangService) {}

  uploadFile(fieldName: string, allowedTypes: string[] = []) {
    return FileInterceptor(fieldName, {
      storage: memoryStorage(), // Simpan di buffer agar bisa dikirim ke ImageKit
      fileFilter: (req, file, cb) => {
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(this.langService.t('invalid_file_type')),
            false,
          );
        }
        cb(null, true);
      },
    } as MulterOptions);
  }
}
