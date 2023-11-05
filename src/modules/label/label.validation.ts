import Joi from 'joi';
import { objectId } from '../validate/custom.validation';

export const createLabel = Joi.object({
  name: Joi.string().required(),
  color: Joi.string(),
});

export const getLabels = {
  query: Joi.object().keys({
    name: Joi.string().allow(''),
    user: Joi.string().custom(objectId),
    project: Joi.string().custom(objectId),
    archived: Joi.boolean(),
    search: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string().allow(''),
  }),
};

export const getLabel = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export const deleteLabel = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export const updateLabel = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    url: Joi.string(),
    size: Joi.number().allow(null),
    type: Joi.string().allow(''),
    private: Joi.boolean(),
    description: Joi.string().allow(''),
    folder: Joi.string().custom(objectId),
    user: Joi.string().custom(objectId),
  }),
};
