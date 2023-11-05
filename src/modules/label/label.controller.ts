import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as labelService from './label.service';

export const createLabel = catchAsync(async (req: Request, res: Response) => {
  const label = await labelService.createLabel(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(label);
});

export const getLabels = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'archived', 'project', 'user']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'search', 'populate']);
  const result = await labelService.queryLabels(filter, options);
  res.send(result);
});

export const getLabel = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const label = await labelService.getLabelById(new mongoose.Types.ObjectId(req.params['id']));
    if (!label) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
    }
    res.send(label);
  }
});

export const deleteLabel = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    await labelService.deleteLabelById(new mongoose.Types.ObjectId(req.params['id']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const updateLabel = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const label = await labelService.updateLabelById(new mongoose.Types.ObjectId(req.params['id']), req.body);
    res.send(label);
  }
});
