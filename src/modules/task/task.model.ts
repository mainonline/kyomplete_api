import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ITask, ITaskDoc, ITaskModel } from './task.interfaces';

const taskSchema = new mongoose.Schema<ITask, ITaskModel>(
  {
    title: { type: String, unique: true, required: true },
    description: { type: String, default: '' },
    cover: { _id: false, id: { type: String }, url: { type: String } },
    attachments: [{ _id: false, id: { type: String }, url: { type: String }, title: { type: String } }],
    dueDate: { type: Date, default: null },
    reminderDate: { type: Date, default: null },
    order: { type: Number, unique: true, default: 0 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    completed: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    parentTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);

/**
 * Check if login is taken
 * @param {string} title - The user's login
 * @param {ObjectId} [excludeTaskId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
taskSchema.static('isTitleTaken', async function (title: string, excludeTaskId: mongoose.ObjectId): Promise<boolean> {
  const task = await this.findOne({ title, _id: { $ne: excludeTaskId } });
  return !!task;
});

async function setOrderMiddleware(this: ITaskDoc, next: (err?: any) => void) {
  if (this.isNew) {
    try {
      const Task = mongoose.model<ITaskDoc, ITaskModel>('Task');
      const highestOrder = await Task.findOne({}, {}, { sort: { order: -1 }, limit: 1 });
      if (highestOrder) {
        this.order = highestOrder.order + 1;
      } else {
        // No existing tasks, set the order to 1 for the first task
        this.order = 1;
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
}

// apply setOrderMiddleware to 'save' and 'findOneAndUpdate' hooks
taskSchema.pre('save', setOrderMiddleware);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

const Task = mongoose.model<ITaskDoc, ITaskModel>('Task', taskSchema);

export default Task;
