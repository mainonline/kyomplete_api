import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Task from './task.model';
import { ApiError } from '../errors';
import { ITask, ITaskDoc } from './task.interfaces';
import { IOptions, QueryResult } from '../paginate/paginate';
import { User } from '../user';

/**
 * Create a task
 * @param {ITask} taskBody
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ITask>}
 */

export const createTask = async (taskBody: ITask, userId: mongoose.Types.ObjectId): Promise<ITask> => {
  if (await Task.isTitleTaken(taskBody.title)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken');
  }

  return Task.create({ ...taskBody, user: userId });
};

/**
 * Query for tasks
 * @returns {Promise<ITask[]>}
 * @param filter
 * @param options
 */

export const queryTasks = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const tasks = await Task.paginate(filter, options);
  return tasks;
};

/**
 * Get task by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITask | null>}
 */

export const getTaskById = async (id: mongoose.Types.ObjectId): Promise<ITask | null> => Task.findById(id);

/**
 * Delete task by id
 * @param {mongoose.Types.ObjectId} id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ITask | null>}
 */

export const deleteTaskById = async (
  id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<ITaskDoc | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  // each user can only delete their own tasks
  const user = await User.findOne({ _id: userId });
  if (!user || !task.user.equals(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You don't have permission to delete this task");
  }

  await task.deleteOne();
  return task;
};

/**
 * Archive task by id
 * @param {mongoose.Types.ObjectId} id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ITask | null>}
 */

export const archiveTaskById = async (
  id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<ITaskDoc | null> => {
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  // each user can only delete their own tasks
  const user = await User.findOne({ _id: userId });
  if (!user || !task.user.equals(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You don't have permission to archive this task");
  }

  await task.updateOne({ archived: true });
  await task.save();
  return task;
};

/**
 * Update task by id
 * @param {ITask} taskBody
 * @returns {Promise<ITask | null>}
 */

export const updateTaskById = async (
  taskBody: Partial<ITask> & {
    id: string;
  }
): Promise<ITask | null> => {
  const task = await Task.findById(new mongoose.Types.ObjectId(taskBody.id));
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  return task.updateOne(taskBody);
};
