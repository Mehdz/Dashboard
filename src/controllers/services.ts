import { Request, Response } from 'express';
import {ServiceModel, IService} from '../models/services';
import { IUser, UserModel } from '../models/user';

export const createService = async (req: Request, res: Response) => {
  const {serviceName, serviceDesc, widgets} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    const checkService: IService | null = await ServiceModel.findOne({serviceName});

    if (!user)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (user.rank !== 'Admin')
      return res.status(400).json({error: 'User doesn\'t have permissions to perform this action.'});
    if (checkService)
      return res.status(400).json({error: 'This service already exists.'});

    const service = await ServiceModel.create({
      serviceName: serviceName,
      serviceDesc: serviceDesc,
      widgets: widgets,
    });

    res.status(200).json({
      status: 'success',
      data: service
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const editService = async (req:Request, res: Response) => {
  const {serviceId, serviceName, serviceDesc, widgetId} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    let service: IService | null = await ServiceModel.findById(serviceId);

    if (!user)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (user.rank !== 'Admin')
      return res.status(400).json({error: 'User doesn\'t have permissions to perform this action.'});
    if (!service)
      return res.status(400).json({error: 'This service doesn\'t exist.'});

    service = await ServiceModel.findByIdAndUpdate(serviceId, {$set: {
      serviceName: serviceName,
      serviceDesc: serviceDesc,
    }}, {returnOriginal: false});

    if (widgetId && service) {
      const index = service.widgets.indexOf(widgetId);
      if (index != -1)
        return res.status(400).json({error: 'This service has already this widget.'});
      service.widgets.push(widgetId);
      service.save();
    }

    res.status(200).json({
      status: 'success',
      data: service
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteService = async (req:Request, res: Response) => {
  const {id} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    const deletedService = await ServiceModel.findOneAndDelete({_id:id});

    if (!user)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (user.rank !== 'Admin')
      return res.status(400).json({error: 'User doesn\'t have permissions to perform this action.'});
    if (!deletedService)
      return res.status(400).json({error: 'This service doesn\'t exist.'});

    res.status(200).json({
      status: 'success',
      message: 'Service has been deleted.'
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getService = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const service: IService | null = await ServiceModel.findById(id);

    if (!service)
      return res.status(400).json({error: 'This service doesn\'t exist.'});
    res.status(200).json({
      status: 'success',
      service
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services: Array<IService> = await ServiceModel.find({});
    res.status(200).json({
      status: 'success',
      data: services
    });
  } catch (error) {
    res.status(500).json(error);
  }
};