import { BadRequestError } from "@errors/BadRequestError";
import { getUploadDir } from "@utils/upload";
import multer, { StorageEngine } from "multer";
import path from "path";

const createStorage = (destination: string): StorageEngine => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    // eslint-disable-next-lint
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
};

// eslint-disable-next-lint

const sizeInMb = 10;
const maxSize = sizeInMb * 1024 * 1024;

const multerConfig = (storage: StorageEngine, maxSize: number) =>
  multer({
    storage,
    fileFilter: (req, file, cb) => {
      // Filter hanya menerima file gambar
      const fileTypes = /\.(jpg|jpeg|png)$/i;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = /image\/(jpg|jpeg|png)$/i.test(file.mimetype);

      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new BadRequestError("Only image file is accepted!", 400, true));
      }
    },
    limits: {
      fileSize: maxSize,
    },
  });

export const uploadSingleImage = (fieldName: string, folderName?: string) => {
  const UPLOADS_DIR = getUploadDir(folderName);

  return multerConfig(createStorage(UPLOADS_DIR), maxSize).single(fieldName);
};
