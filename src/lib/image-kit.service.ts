import { imageKit } from '@config/image-kit.config';
import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { PrismaService } from './prisma.service';

@Injectable()
export class ImageKitService {
  private imagekit = new ImageKit({
    publicKey: imageKit().publicKey,
    privateKey: imageKit().privateKey,
    urlEndpoint: imageKit().urlEndpoint,
  });

  constructor(private readonly prismaService: PrismaService) {}

  async uploadFile(file: Express.Multer.File, folderName: string, relatedId?: number) {
    const response = await this.imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: `/${imageKit().baseFolder}/${folderName}`,
    });

    const newImage = await this.prismaService.imageKit.create({
      data: {
        fileId: response.fileId,
        filePath: response.filePath,
        fileName: response.name,
        url: response.url,
        size: response.size,
        height: response.height,
        width: response.width,
        format: response.fileType,
        type: folderName,
        relatedId,
      },
    });

    return newImage;
  }

  async getImageUrl(fileId: string) {
    const response = await this.prismaService.imageKit.findFirst({
      where: { fileId },
    });

    return response.url;
  }

  async getManyImageUrlByFileId(fileIds: string[]) {
    const response = await this.prismaService.imageKit.findMany({
      where: {
        fileId: {
          in: fileIds,
        },
      },
    });

    return response;
  }

  async updateRelatedId(fileId: string, relatedId: number) {
    return await this.prismaService.imageKit.update({
      where: { fileId },
      data: { relatedId },
    });
  }

  async deleteFile(fileId: string) {
    await this.imagekit.deleteFile(fileId);
    await this.prismaService.imageKit.delete({ where: { fileId } });
  }

  async deleteFiles(fileIds: string[]) {
    await this.imagekit.bulkDeleteFiles(fileIds);
    await this.prismaService.imageKit.deleteMany({
      where: {
        fileId: {
          in: fileIds,
        },
      },
    });
  }
}
