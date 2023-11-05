import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as userService from './user.service';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Пользователь не создан');
  }
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'search']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['id']));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Пользователь не найден');
    }
    res.send(user);
  }
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(req.body);
  res.send(user);
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    await userService.deleteUserById(new mongoose.Types.ObjectId(req.params['id']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
