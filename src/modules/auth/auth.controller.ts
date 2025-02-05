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
import { LoginDto, LoginResponseDto, loginSchema } from './dto/login.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly validationService: ValidationService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileUploadInterceptor.uploadFile('avatar', IMG_MIMETYPE))
  async register(
    @Body() body: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<RegisterResponseDto>> {
    const validateData = { ...body, avatar: file };

    await this.validationService.validateAsync(registerSchema, validateData);

    const newUser = await this.authService.register(validateData);

    return {
      error: false,
      message: 'OK',
      data: newUser,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<WebResponse<LoginResponseDto>> {
    await this.validationService.validateAsync(loginSchema, body);

    const response = await this.authService.login(body);

    return {
      error: false,
      message: 'OK',
      data: response,
    };
  }
}
