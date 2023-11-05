import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ILabel, ILabelDoc, ILabelModel } from './label.interfaces';

const labelSchema = new mongoose.Schema<ILabel, ILabelModel>(
  {
    name: { type: String, required: true, trim: true },
    color: { type: String, trim: true, default: '#000000' },
    archived: { type: Boolean, default: false },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
labelSchema.plugin(toJSON);
labelSchema.plugin(paginate);

const Label = mongoose.model<ILabelDoc, ILabelModel>('Label', labelSchema);

export default Label;
