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

  Object.assign(task, taskBody);
  if (taskBody.completed) {
    task.status = 'done';
  }
  await task.save();
  return task;
};

/**
 * Complete task by id
 * @param {mongoose.Types.ObjectId} id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ITask | null>}
 */

export const completeTaskById = async (
  id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<ITask | null> => {
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  // check if the user is the owner of the task or a member of the task
  if (!task.user.equals(userId) && !task.members.includes(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You don't have permission to complete this task");
  }

  await task.updateOne({ completed: true, status: 'done' });
  await task.save();
  return task;
};

/**
 * Clone task by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITask | null>}
 */
export const cloneTaskById = async (id: mongoose.Types.ObjectId): Promise<ITask | null> => {
  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  // Clone all properties of the task except for the id
  const newTaskData = { ...task.toObject() };
  delete newTaskData._id; // Remove the _id property

  const newTask = new Task(newTaskData);

  try {
    const savedTask = await newTask.save();
    return savedTask;
  } catch (error) {
    // Handle any save errors here
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to clone the task');
  }
};

/**
 * Reorder a task and update the order of all other tasks accordingly.
 * @param {number} currentOrder - The current order value for the task.
 * @param {number} newOrder - The new order value for the task.
 * @returns {Promise<ITask | null>}
 */
export const reorderTask = async (currentOrder: number, newOrder: number): Promise<ITask | null> => {
  try {
    // Find the task by ID
    const taskToReorder = await Task.findOne({ order: currentOrder });
    const taskToToggle = await Task.findOne({ order: newOrder });

    if (!taskToReorder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }

    if (!taskToToggle) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }

    // Update the task's order field with the new value
    taskToReorder.order = newOrder;
    taskToToggle.order = currentOrder;

    // Save the updated task
    const updatedTask = await taskToReorder.save();
    await taskToToggle.save();

    return updatedTask;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to reorder the task');
  }
};
