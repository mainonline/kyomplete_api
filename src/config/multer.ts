import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (
      ext !== '.jpg' &&
      ext !== '.jpeg' &&
      ext !== '.png' &&
      ext !== '.webp' &&
      ext !== '.pdf' &&
      ext !== '.zip' &&
      ext !== '.docx' &&
      ext !== '.doc' &&
      ext !== '.xls' &&
      ext !== '.xlsx' &&
      ext !== '.ppt' &&
      ext !== '.pptx' &&
      ext !== '.csv' &&
      ext !== '.txt' &&
      ext !== '.svg'
    ) {
      cb(null, false);
      return;
    }
    cb(null, true);
  },
});

export default upload;
