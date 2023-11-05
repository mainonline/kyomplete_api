import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { roles } from '../../config/roles';
import { IUserDoc, IUserModel } from './user.interfaces';

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    login: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    phone: { type: String, default: null, required: false },
    image: {
      _id: false,
      id: {
        type: String,
        default: null,
        required: false,
      },
      url: {
        type: String,
        default: null,
        required: false,
      },
    },
    isArchived: { type: Boolean, default: false },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

/**
 * Check if login is taken
 * @param {string} login - The user's login
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isLoginTaken', async function (login: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ login, _id: { $ne: excludeUserId } });
  return !!user;
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.password);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Set the default projection for find queries to include 'createdAt' and 'updatedAt'
userSchema.set('toObject', {
  getters: true,
  versionKey: false,
  transform: (_doc: any, ret: any) => {
    // eslint-disable-next-line no-param-reassign
    delete ret._id;
  },
});

userSchema.set('toJSON', {
  getters: true,
  versionKey: false,
  transform: (_doc: any, ret: any) => {
    // eslint-disable-next-line no-param-reassign
    delete ret._id;
  },
});

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export default User;
