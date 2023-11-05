import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ITag {
  name: string;
  archived: boolean;
  project: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

export interface ITagDoc extends ITag, Document {}

export interface ITagModel extends Model<ITagDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
