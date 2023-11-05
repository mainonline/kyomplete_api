import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Token from '../token/token.model';
import ApiError from '../errors/ApiError';
import tokenTypes from '../token/token.types';
import { getUserByEmail, getUserByEmailOrLogin, getUserById, updateUserById } from '../user/user.service';
import { IUserDoc, IUserWithTokens } from '../user/user.interfaces';
import { generateAuthTokens, verifyToken } from '../token/token.service';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
  }
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid username or password');
  }

  return user;
};

/**
 * Login with email or login and password
 * @param {string} emailOrLogin
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 * Validate is email or login
 */

export const loginUserWithEmailOrLoginAndPassword = async (emailOrLogin: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmailOrLogin(emailOrLogin);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid username or password');
  }

  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await updateUserById({ id: user.id, password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Сброс пароля не удался');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (verifyEmailToken: any): Promise<IUserDoc | null> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await getUserById(new mongoose.Types.ObjectId(verifyEmailTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    return await updateUserById({ id: user.id, isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Проверка почты не удалась');
  }
};
