import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { WebResponse } from '@common/types/web-response.type';
import {
  RegisterDto,
  RegisterResponseDto,
  registerSchema,
} from './dto/register.dto';
import { ValidationService } from '@lib/validation.service';
import { FileUploadInterceptor } from '@common/interceptors/file-upload.interceptor';
import { IMG_MIMETYPE } from '@common/constants/image-mimetype.constant';

@Controller('/auth')
export class AuthController {
  constructor(
    private validationService: ValidationService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileUploadInterceptor.uploadFile('avatar', IMG_MIMETYPE))
  async register(
    @Body() body: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<RegisterResponseDto>> {
    console.log(file);

    this.validationService.validate(registerSchema, body);

    const newUser = await this.authService.register(body);

    return {
      error: false,
      message: 'OK',
      data: newUser,
    };
  }
}
