import Joi from 'joi';
import { objectId } from '../validate/custom.validation';

export const createTask = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  banner: Joi.object().keys({
    id: Joi.string().allow('', null),
    url: Joi.string().allow('', null),
  }),
  attachments: Joi.array().items(
    Joi.object().keys({
      id: Joi.string().allow('', null),
      url: Joi.string().allow('', null),
      title: Joi.string(),
    })
  ),
  dueDate: Joi.date().allow('', null),
  reminderDate: Joi.date().allow('', null),
  priority: Joi.string().allow(''),
  completed: Joi.boolean(),
  hidden: Joi.boolean(),
  archived: Joi.boolean(),
  cover: Joi.object().keys({
    id: Joi.string().allow('', null),
    url: Joi.string().allow('', null),
  }),
  owner: Joi.string().custom(objectId),
  members: Joi.array().items(Joi.string().custom(objectId)),
  parentTasks: Joi.array().items(Joi.string().custom(objectId)),
  subTasks: Joi.array().items(Joi.string().custom(objectId)),
  tags: Joi.array().items(Joi.string().custom(objectId)),
  labels: Joi.array().items(Joi.string().custom(objectId)),
  projects: Joi.array().items(Joi.string().custom(objectId)),
});

export const getTasks = {
  query: Joi.object().keys({
    title: Joi.string().allow(''),
    search: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string().allow(''),
    user: Joi.string().custom(objectId),
    priority: Joi.string().allow(''),
    completed: Joi.boolean(),
    hidden: Joi.boolean(),
    archived: Joi.boolean(),
    members: Joi.string().allow(''),
    parentTasks: Joi.string().allow(''),
    subTasks: Joi.string().allow(''),
    tags: Joi.string().allow(''),
    labels: Joi.string().allow(''),
    projects: Joi.string().allow(''),
  }),
};

export const getTask = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export const deleteTask = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export const reorderTasks = {
  query: Joi.object().keys({
    currentOrder: Joi.number().integer(),
    newOrder: Joi.number().integer(),
  }),
};

export const updateTask = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
    title: Joi.string(),
    description: Joi.string().allow(''),
    attachments: Joi.array().items(
      Joi.object().keys({
        id: Joi.string().allow('', null),
        url: Joi.string().allow('', null),
        title: Joi.string(),
      })
    ),
    dueDate: Joi.date().allow('', null),
    status: Joi.string().allow(''),
    reminderDate: Joi.date().allow('', null),
    priority: Joi.string().allow(''),
    completed: Joi.boolean(),
    order: Joi.number().integer(),
    hidden: Joi.boolean(),
    archived: Joi.boolean(),
    cover: Joi.object().keys({
      id: Joi.string().allow('', null),
      url: Joi.string().allow('', null),
    }),
    user: Joi.string().custom(objectId),
    members: Joi.array().items(Joi.string().custom(objectId)),
    parentTasks: Joi.array().items(Joi.string().custom(objectId)),
    subTasks: Joi.array().items(Joi.string().custom(objectId)),
    tags: Joi.array().items(Joi.string().custom(objectId)),
    labels: Joi.array().items(Joi.string().custom(objectId)),
    projects: Joi.array().items(Joi.string().custom(objectId)),
  }),
};
