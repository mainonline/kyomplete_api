import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as projectService from './project.service';

export const createProject = catchAsync(async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(project);
});

export const getProjects = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'folder']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'search', 'populate']);
  const result = await projectService.queryProjects(filter, options);
  res.send(result);
});

export const getProject = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const project = await projectService.getProjectById(new mongoose.Types.ObjectId(req.params['id']));
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    res.send(project);
  }
});

export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    await projectService.deleteProjectById(new mongoose.Types.ObjectId(req.params['id']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const updateProject = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const project = await projectService.updateProjectById(new mongoose.Types.ObjectId(req.params['id']), req.body);
    res.send(project);
  }
});
