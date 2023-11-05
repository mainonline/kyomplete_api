import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as taskService from './task.service';

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(task);
});

export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, [
    'title',
    'owner',
    'priority',
    'completed',
    'hidden',
    'archived',
    'members',
    'parentTasks',
    'subTasks',
    'tags',
    'labels',
    'projects',
  ]);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'search', 'populate']);
  const result = await taskService.queryTasks(filter, options);
  res.send(result);
});

export const getTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const task = await taskService.getTaskById(new mongoose.Types.ObjectId(req.params['id']));
    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }
    res.send(task);
  }
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    await taskService.deleteTaskById(new mongoose.Types.ObjectId(req.params['id']), req.user.id);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const archiveTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const task = await taskService.archiveTaskById(new mongoose.Types.ObjectId(req.params['id']), req.user.id);
    res.send(task);
  }
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.updateTaskById(req.body);
  res.send(task);
});

export const completeTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const task = await taskService.completeTaskById(new mongoose.Types.ObjectId(req.params['id']), req.user.id);
    res.send(task);
  }
});

export const cloneTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const task = await taskService.cloneTaskById(new mongoose.Types.ObjectId(req.params['id']));
    res.send(task);
  }
});

export const reorderTasks = catchAsync(async (req: Request, res: Response) => {
  const { id, order } = req.query;
  const tasks = await taskService.reorderTask(new mongoose.Types.ObjectId(id as string), parseInt(order as string, 10));
  res.send(tasks);
});
