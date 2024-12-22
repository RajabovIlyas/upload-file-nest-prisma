import { diskStorage } from 'multer';
import { v4 as uuidV4 } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const saveFileToStorage: MulterOptions = {
  storage: diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const filename: string = uuidV4();
      const extension: string[] = file.originalname.split('.');
      cb(null, `${filename}.${extension[extension.length - 1]}`);
    },
  }),
};
