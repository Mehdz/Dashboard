import { Schema, model, Document, Model } from 'mongoose';
import { IService } from './services';
import { IWidget } from './widgets';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  password : string;
  email : string;
  verifiedEmail: boolean;
  rank: string;
  token: string;
  userServices: Array<IService>;
  userWidgets: Array<IWidget>;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  verifiedEmail : {
    type: Boolean,
    default: false
  },
  rank : {
    type: String,
    default: 'User'
  },
  token : {
    type: String,
    default: ''
  },
  userServices: [{
    type: Schema.Types.ObjectId,
    ref: 'serviceSchema',
    default: []
  }],
  userWidgets : [{
    type: Schema.Types.ObjectId,
    ref: 'widgetSchema',
    default: []
  }],
});

const UserModel: Model<IUser> = model<IUser>('User', userSchema);

export {UserModel, IUser};
