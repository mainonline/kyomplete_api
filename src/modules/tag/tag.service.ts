import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Tag from './tag.model';
import { ApiError } from '../errors';
import { ITag, ITagDoc } from './tag.interfaces';
import { IOptions, QueryResult } from '../paginate/paginate';

/**
 * Create a tag
 * @param {ITag} tagBody
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ITag>}
 */

export const createTag = async (tagBody: ITag, userId: mongoose.Types.ObjectId): Promise<ITag> => {
  const tag = await Tag.create({ ...tagBody, user: userId });
  return tag;
};

/**
 * Query for tags
 * @returns {Promise<ITag[]>}
 * @param filter
 * @param options
 */

export const queryTags = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const tags = await Tag.paginate(filter, options);
  return tags;
};

/**
 * Get tag by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITag | null>}
 */

export const getTagById = async (id: mongoose.Types.ObjectId): Promise<ITag | null> => Tag.findById(id);

/**
 * Delete tag by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITag | null>}
 */

export const deleteTagById = async (id: mongoose.Types.ObjectId): Promise<ITagDoc | null> => {
  const tag = await Tag.findById(id);
  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }

  await tag.deleteOne();
  return tag;
};

/**
 * Update tag by id
 * @param {mongoose.Types.ObjectId} id
 * @param {ITag} tagBody
 * @returns {Promise<ITag | null>}
 */

export const updateTagById = async (id: mongoose.Types.ObjectId, tagBody: ITag): Promise<ITag | null> => {
  const tag = await Tag.findById(id);
  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }

  return tag.updateOne(tagBody);
};
