import { imageKit } from '@config/image-kit.config';
import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';

@Injectable()
export class ImageKitService {
  private imagekit = new ImageKit({
    publicKey: imageKit().publicKey,
    privateKey: imageKit().privateKey,
    urlEndpoint: imageKit().urlEndpoint,
  });

  async uploadFile(file: Express.Multer.File, folderName: string) {
    const response = await this.imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: `/${imageKit().baseFolder}/${folderName}`,
    });
    return {
      filePath: response.filePath,
      fileId: response.fileId,
      fileUrl: response.url,
    };
  }

  async getImageUrl(fileId: string) {
    const response = await this.imagekit.getFileDetails(fileId);

    return response.url;
  }

  async deleteFile(fileId: string) {
    await this.imagekit.deleteFile(fileId);
  }

  async deleteFiles(fileIds: string[]) {
    await this.imagekit.bulkDeleteFiles(fileIds);
  }
}
