import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as tagService from './tag.service';

export const createTag = catchAsync(async (req: Request, res: Response) => {
  const tag = await tagService.createTag(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(tag);
});

export const getTags = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'archived', 'project', 'user']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'search', 'populate']);
  const result = await tagService.queryTags(filter, options);
  res.send(result);
});

export const getTag = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const tag = await tagService.getTagById(new mongoose.Types.ObjectId(req.params['id']));
    if (!tag) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
    }
    res.send(tag);
  }
});

export const deleteTag = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    await tagService.deleteTagById(new mongoose.Types.ObjectId(req.params['id']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const updateTag = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const tag = await tagService.updateTagById(new mongoose.Types.ObjectId(req.params['id']), req.body);
    res.send(tag);
  }
});
