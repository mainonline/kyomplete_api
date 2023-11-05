import cloudinary, { UploadApiResponse } from 'cloudinary';
import config from './config';

cloudinary.v2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export const uploads = (file: string, folder: string): Promise<{ url: string; id: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload(
        file,
        {
          folder,
          overwrite: true,
          invalidate: true,
          resource_type: 'auto',
          transformation: [{ flags: 'attachment' }],
        },
        (error: any, result?: UploadApiResponse) => {
          if (error) {
            reject(error);
          } else if (result !== undefined) {
            const url = result.secure_url;
            const id = result.public_id;
            if (url && id) {
              resolve({ url, id });
            } else {
              reject(new Error('Invalid response from Cloudinary'));
            }
          } else {
            reject(new Error('Upload failed'));
          }
        }
      )
      .then((r) => console.log(r));
  });
};

export const destroy = (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .destroy(publicId, { invalidate: true }, (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .then((r) => console.log(r));
  });
};
