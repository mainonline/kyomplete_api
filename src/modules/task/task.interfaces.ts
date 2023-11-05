import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IImage {
  id: string;
  url: string;
}

export interface IAttachment {
  id: string;
  url: string;
  title: string;
}

export interface ITask {
  title: string;
  description: string;
  cover: IImage;
  attachments?: [IAttachment];
  dueDate: Date;
  reminderDate: Date;
  priority: string;
  completed: boolean;
  hidden: boolean;
  archived: boolean;
  status: string;
  order: number;
  user: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  parentTasks: mongoose.Types.ObjectId[];
  subTasks: mongoose.Types.ObjectId[];
  tags: mongoose.Types.ObjectId[];
  labels: mongoose.Types.ObjectId[];
  projects: mongoose.Types.ObjectId[];
}

export interface ITaskDoc extends ITask, Document {}

export interface ITaskModel extends Model<ITaskDoc> {
  isTitleTaken(title: string, excludeTaskId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
