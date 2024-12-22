import { UploadFileDto } from '../dtos/upload-file.dto';

export const transformFileDataForStorage = (uploadFile: UploadFileDto) => {
  const { filename, fieldname, destination, originalname, ...newFile } =
    uploadFile;
  return { ...newFile, name: filename };
};
