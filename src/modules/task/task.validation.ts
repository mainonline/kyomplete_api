import Joi from 'joi';
import { objectId } from '../validate/custom.validation';

export const createTask = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  banner: Joi.object().keys({
    id: Joi.string(),
    url: Joi.string(),
  }),
  attachments: Joi.array().items(
    Joi.object().keys({
      id: Joi.string(),
      url: Joi.string(),
      title: Joi.string(),
    })
  ),
  dueDate: Joi.date(),
  reminderDate: Joi.date(),
  priority: Joi.string().allow(''),
  completed: Joi.boolean(),
  hidden: Joi.boolean(),
  archived: Joi.boolean(),
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
    owner: Joi.string().custom(objectId),
    priority: Joi.string().allow(''),
    completed: Joi.boolean(),
    hidden: Joi.boolean(),
    archived: Joi.boolean(),
    member: Joi.array().items(Joi.string().custom(objectId)),
    parentTask: Joi.array().items(Joi.string().custom(objectId)),
    subTask: Joi.array().items(Joi.string().custom(objectId)),
    tags: Joi.array().items(Joi.string().custom(objectId)),
    label: Joi.array().items(Joi.string().custom(objectId)),
    project: Joi.array().items(Joi.string().custom(objectId)),
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
    id: Joi.string().custom(objectId),
    order: Joi.number().integer(),
  }),
};

export const updateTask = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    banner: Joi.object().keys({
      id: Joi.string(),
      url: Joi.string(),
    }),
    attachments: Joi.array().items(
      Joi.object().keys({
        id: Joi.string(),
        url: Joi.string(),
        title: Joi.string(),
      })
    ),
    dueDate: Joi.date(),
    reminderDate: Joi.date(),
    priority: Joi.string().allow(''),
    completed: Joi.boolean(),
    hidden: Joi.boolean(),
    archived: Joi.boolean(),
    owner: Joi.string().custom(objectId),
    members: Joi.array().items(Joi.string().custom(objectId)),
    parentTasks: Joi.array().items(Joi.string().custom(objectId)),
    subTasks: Joi.array().items(Joi.string().custom(objectId)),
    tags: Joi.array().items(Joi.string().custom(objectId)),
    labels: Joi.array().items(Joi.string().custom(objectId)),
    projects: Joi.array().items(Joi.string().custom(objectId)),
  }),
};
