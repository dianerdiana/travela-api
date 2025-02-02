import { imageKit } from '@config/image-kit.config';
import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';

@Injectable()
export class ImageKitService {
  private imagekit: ImageKit;

  constructor() {
    this.imagekit = new ImageKit({
      publicKey: imageKit().publicKey,
      privateKey: imageKit().privateKey,
      urlEndpoint: imageKit().urlEndpoint,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const response = await this.imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: imageKit().baseFolder,
      });

      return {
        filePath: response.filePath,
        fileId: response.fileId,
        fileType: response.fileType,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
