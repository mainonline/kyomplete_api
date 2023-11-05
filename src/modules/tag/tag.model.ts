import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ITag, ITagDoc, ITagModel } from './tag.interfaces';

const tagSchema = new mongoose.Schema<ITag, ITagModel>(
  {
    name: { type: String, required: true, trim: true },
    archived: { type: Boolean, default: false },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
tagSchema.plugin(toJSON);
tagSchema.plugin(paginate);

const Tag = mongoose.model<ITagDoc, ITagModel>('Tag', tagSchema);

export default Tag;
