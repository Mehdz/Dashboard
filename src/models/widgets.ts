import { Schema, model, Document, Model } from 'mongoose';

interface IWidget extends Document {
    widgetName: string;
    widgetDesc: string;
    settings: object;
}

const widgetSchema = new Schema<IWidget>({
  widgetName: {
    type: String,
    required: true
  },
  widgetDesc : {
    type: String,
    required: true
  },
  settings: {
    type: Object,
    default: null
  }
});

const WidgetModel: Model<IWidget> = model<IWidget>('Widgets', widgetSchema);

export {widgetSchema, WidgetModel, IWidget};
