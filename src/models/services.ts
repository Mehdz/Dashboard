import { Schema, model, Document, Model } from 'mongoose';
import { IWidget } from './widgets';

interface IService extends Document {
    serviceName: string;
    serviceDesc: string;
    widgets : Array<IWidget>

}

const serviceSchema = new Schema<IService>({
  serviceName: {
    type: String,
    required: true,
    unique: true
  },
  serviceDesc : {
    type: String,
    default: ''
  },
  widgets : [{
    type: Schema.Types.ObjectId,
    ref: 'widgetSchema',
    default: []
  }],
});

const ServiceModel: Model<IService> = model<IService>('Services', serviceSchema);

export {ServiceModel, IService, serviceSchema};
