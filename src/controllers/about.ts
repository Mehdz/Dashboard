import { Request, Response } from 'express';
import { IService, ServiceModel } from '../models/services';
import {WidgetModel, IWidget} from '../models/widgets';

const getWidget = async (ids: Array<IWidget>) => {
  try {
    const promises = ids.map(async (item, key) => {
      const widget: IWidget | null = await WidgetModel.findById(item._id);
      const data: object = {
        name : widget?.widgetName,
        description : widget?.widgetDesc,
        params : [{
          name: 'positions',
          type: 'array'
        },
        {
          name: 'otherParams',
          type: 'any'
        },],
      };
      return data;
    });

    return Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
};

const getAllServices = async () => {
  try {
    const services: Array<IService> = await ServiceModel.find({});
    const promises = services?.map(async (item, key) => {
      const widget = await getWidget(item.widgets);
      const data: object = {
        name : item.serviceName,
        description : item.serviceDesc,
        widgets : widget
      };
      return data;
    });

    return Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
};

export const getAbout = async (req:Request, res: Response) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const currentTime = Date.now();

  try {
    const services = await getAllServices();

    res.status(200).json({
      client : {
        host : ip
      },
      server : {
        current_time: currentTime,
        services:
          services
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
};