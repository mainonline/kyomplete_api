import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Project from './project.model';
import { ApiError } from '../errors';
import { IProject, IProjectDoc } from './project.interfaces';
import { IOptions, QueryResult } from '../paginate/paginate';

/**
 * Create a project
 * @param {IProject} projectBody
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IProject>}
 */

export const createProject = async (projectBody: IProject, userId: mongoose.Types.ObjectId): Promise<IProject> => {
  return Project.create({ ...projectBody, user: userId });
};

/**
 * Query for projects
 * @returns {Promise<IProject[]>}
 * @param filter
 * @param options
 */

export const queryProjects = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const projects = await Project.paginate(filter, options);
  return projects;
};

/**
 * Get project by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProject | null>}
 */

export const getProjectById = async (id: mongoose.Types.ObjectId): Promise<IProject | null> => Project.findById(id);

/**
 * Delete project by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProject | null>}
 */

export const deleteProjectById = async (id: mongoose.Types.ObjectId): Promise<IProjectDoc | null> => {
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  await project.deleteOne();
  return project;
};

/**
 * Update project by id
 * @param {mongoose.Types.ObjectId} id
 * @param {IProject} projectBody
 * @returns {Promise<IProject | null>}
 */

export const updateProjectById = async (id: mongoose.Types.ObjectId, projectBody: IProject): Promise<IProject | null> => {
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return project.updateOne(projectBody);
};
