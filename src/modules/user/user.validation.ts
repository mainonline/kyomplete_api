import Joi from 'joi';
import { password, objectId } from '../validate/custom.validation';
import { NewCreatedUser } from './user.interfaces';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  login: Joi.string().alphanum().min(3).max(30).required(),
  image: {
    id: Joi.string(),
    url: Joi.string(),
  },
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string().allow('', null),
    role: Joi.string().allow('', null),
    search: Joi.string().allow('', null),
    sortBy: Joi.string().allow('', null),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  body: Joi.object()
    .keys({
      id: Joi.string().custom(objectId),
      email: Joi.string().email(),
      name: Joi.string(),
      image: {
        id: Joi.string(),
        url: Joi.string(),
      },
      login: Joi.string(),
      deals: Joi.number().integer(),
      phone: Joi.string(),
      password: Joi.string().custom(password),
      isArchived: Joi.boolean(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};
