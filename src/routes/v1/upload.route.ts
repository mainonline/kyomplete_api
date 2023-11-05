import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import upload from '../../config/multer';
import { uploadController } from '../../modules/upload';

const router: Router = express.Router();

router.route('/multiple').post(auth(), upload.array('files'), uploadController.uploadFiles);
router.route('/single').post(auth(), upload.single('file'), uploadController.uploadFile);
router.route('/delete').delete(auth(), uploadController.deleteFile);

export default router;
