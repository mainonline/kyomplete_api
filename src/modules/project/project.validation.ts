import Joi from 'joi';
import { objectId } from '../validate/custom.validation';

export const createProject = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  members: Joi.array().items(Joi.string().custom(objectId)),
  tasks: Joi.array().items(Joi.string().custom(objectId)),
  archived: Joi.boolean(),
  user: Joi.string().custom(objectId),
});

export const getProjects = {
  query: Joi.object().keys({
    name: Joi.string().allow(''),
    user: Joi.string().custom(objectId),
    folder: Joi.string().custom(objectId),
    search: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string().allow(''),
  }),
};

export const getProject = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export const deleteProject = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export const updateProject = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    members: Joi.array().items(Joi.string().custom(objectId)),
    tasks: Joi.array().items(Joi.string().custom(objectId)),
    archived: Joi.boolean(),
    user: Joi.string().custom(objectId),
  }),
};
