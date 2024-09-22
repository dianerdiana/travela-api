import path from "path";
import fs from "fs";

export const getUploadDir = (folderName?: string) => {
  const baseDir = path.resolve(__dirname, "../../uploads");
  const UPLOADS_DIR = folderName ? path.join(baseDir, folderName) : baseDir;

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
  }

  return UPLOADS_DIR;
};
