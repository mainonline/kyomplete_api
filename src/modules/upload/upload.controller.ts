import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as uploadService from './upload.service';

export const uploadFiles = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const file of req.files as Express.Multer.File[]) {
    if (!file || file?.size === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
    }
    if (file?.size > 10048576) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'File size is too large');
    }
  }

  const document = await uploadService.uploadMultipleFiles(req.files as Express.Multer.File[]);
  res.status(httpStatus.CREATED).send(document);
});

export const uploadFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file || req.file?.size === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
  }

  if (req.file?.size > 10048576) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File size is too large');
  }

  const document = await uploadService.uploadSingleFile(req.file as Express.Multer.File);
  res.status(httpStatus.CREATED).send(document);
});

export const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File id is required');
  }
  await uploadService.deleteFile(id);
  res.status(httpStatus.NO_CONTENT).send();
});
