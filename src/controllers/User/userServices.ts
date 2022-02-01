import { Request, Response } from 'express';
import {UserModel, IUser} from '../../models/user';
import { IService, ServiceModel } from '../../models/services';

export const addService = async (req:Request, res: Response) => {
  const {serviceId} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const service: IService | null = await ServiceModel.findById(serviceId);
    const user: IUser | null = await UserModel.findOne({token : parsedToken});

    if (!service)
      return res.status(400).json({error: 'This service doesn\'t exist'});
    if (!user)
      return res.status(400).json({error: 'This user doesn\'t exist'});
    const index = user.userServices.indexOf(serviceId);
    if (index != -1)
      return res.status(400).json({error: 'This user already added this service.'});
    user.userServices.push(service._id);
    user.save();
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const removeService = async (req:Request, res: Response) => {
  const {serviceId} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const service: IService | null = await ServiceModel.findById(serviceId);
    const user: IUser | null = await UserModel.findOne({token : parsedToken});

    if (!service)
      return res.status(400).json({error: 'This service doesn\'t exist'});
    if (!user)
      return res.status(400).json({error: 'This user doesn\'t exist'});
    const index = user.userServices.indexOf(serviceId);
    if (index == -1)
      return res.status(400).json({error: 'This user didn\'t add this service.'});
    user.userServices.splice(index, 1);
    user.save();
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserServices = async (req: Request, res: Response) => {
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token : parsedToken});
    const services: Array<IService> = await ServiceModel.find({
      '_id': { $in:user?.userServices}
    });
    res.status(200).json({
      status: 'success',
      data: services
    });
  } catch (error) {
    res.status(500).json(error);
  }
};