import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ILabel {
  name: string;
  color: string;
  archived: boolean;
  project: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

export interface ILabelDoc extends ILabel, Document {}

export interface ILabelModel extends Model<ILabelDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
