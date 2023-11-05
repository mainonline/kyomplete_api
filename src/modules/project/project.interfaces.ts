import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IProject {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  tasks: mongoose.Types.ObjectId[];
  archived: boolean;
  user: mongoose.Types.ObjectId;
}

export interface IProjectDoc extends IProject, Document {}

export interface IProjectModel extends Model<IProjectDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
