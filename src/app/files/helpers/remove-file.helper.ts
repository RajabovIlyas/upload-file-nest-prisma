import * as fs from 'fs';

export const removeFile = (path: string) => {
  if (fs.existsSync(path)) {
    fs.unlink(path, () => {});
  }
};