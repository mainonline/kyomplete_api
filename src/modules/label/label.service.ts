import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Label from './label.model';
import { ApiError } from '../errors';
import { ILabel, ILabelDoc } from './label.interfaces';
import { IOptions, QueryResult } from '../paginate/paginate';

/**
 * Create a label
 * @param {ILabel} labelBody
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ILabel>}
 */

export const createLabel = async (labelBody: ILabel, userId: mongoose.Types.ObjectId): Promise<ILabel> => {
  const label = await Label.create({ ...labelBody, user: userId });
  return label;
};

/**
 * Query for labels
 * @returns {Promise<ILabel[]>}
 * @param filter
 * @param options
 */

export const queryLabels = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const labels = await Label.paginate(filter, options);
  return labels;
};

/**
 * Get label by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ILabel | null>}
 */

export const getLabelById = async (id: mongoose.Types.ObjectId): Promise<ILabel | null> => Label.findById(id);

/**
 * Delete label by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ILabel | null>}
 */

export const deleteLabelById = async (id: mongoose.Types.ObjectId): Promise<ILabelDoc | null> => {
  const label = await Label.findById(id);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }

  await label.deleteOne();
  return label;
};

/**
 * Update label by id
 * @param {mongoose.Types.ObjectId} id
 * @param {ILabel} labelBody
 * @returns {Promise<ILabel | null>}
 */

export const updateLabelById = async (id: mongoose.Types.ObjectId, labelBody: ILabel): Promise<ILabel | null> => {
  const label = await Label.findById(id);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }

  return label.updateOne(labelBody);
};
