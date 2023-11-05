import httpStatus from 'http-status';
import mongoose from 'mongoose';
import User from './user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedUser, UpdateUserBody, IUserDoc, NewRegisteredUser } from './user.interfaces';

/**
 * Create a manager user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (await User.isLoginTaken(userBody.login)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Login already taken');
  }

  const user = await User.create({ ...userBody, emailForNotifications: userBody.email, role: 'manager' });
  await user.save();
  return user;
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (userBody.login && (await User.isLoginTaken(userBody.login))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Login already taken');
  }

  const user = await User.create({ ...userBody, emailForNotifications: userBody.email });

  await user.save();
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> => User.findOne({ email });

/**
 * Get user by email or login
 * @param {string} emailOrLogin
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmailOrLogin = async (emailOrLogin: string): Promise<IUserDoc | null> =>
  User.findOne({ $or: [{ email: emailOrLogin }, { login: emailOrLogin }] });

/**
 * Get admin users
 * @returns {Promise<IUserDoc[]>}
 */
export const getAdminUsers = async (): Promise<IUserDoc[] | []> => User.find({ role: 'admin' });

/**
 * Update user by id
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (updateBody: UpdateUserBody): Promise<IUserDoc | null> => {
  const user = await getUserById(new mongoose.Types.ObjectId(updateBody.id));
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, new mongoose.Types.ObjectId(updateBody.id)))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (updateBody.login && (await User.isLoginTaken(updateBody.login, new mongoose.Types.ObjectId(updateBody.id)))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Login already taken');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};
