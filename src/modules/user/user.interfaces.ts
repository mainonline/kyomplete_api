import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IImage {
  url: string;
  id: string;
}

export interface IUser {
  name: string;
  login: string;
  email: string;
  password: string;
  role: string;
  image?: IImage;
  phone?: string;
  isEmailVerified: boolean;
  isArchived: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  isLoginTaken(login: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser> & { id: string };

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified' | 'image' | 'isArchived'>;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified' | 'isArchived' | 'role'>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
