import * as fs from 'fs';
import * as cloudinary from '../../config/cloudinary';
import { IImage } from '../user/user.interfaces';

export const uploadMultipleFiles = async (files: Express.Multer.File[]): Promise<IImage[]> => {
  const urls: IImage[] = [];
  if (files && files.length > 0) {
    const uploadPromises = files.map(async (file) => {
      const { path } = file;
      const { id, url } = await cloudinary.uploads(path, 'shared');
      fs.unlinkSync(path); // Delete uploaded image from the server
      urls.push({ id, url });
    });
    await Promise.all(uploadPromises);
  }
  return urls;
};

export const uploadSingleFile = async (file: Express.Multer.File): Promise<IImage> => {
  const { path } = file;
  const { id, url } = await cloudinary.uploads(path, 'shared');
  fs.unlinkSync(path);

  return { id, url };
};

export const deleteFile = async (id: string): Promise<void> => {
  const result = await cloudinary.destroy(id);
  if (result.result !== 'ok') {
    throw new Error('Failed to delete file');
  }
};
