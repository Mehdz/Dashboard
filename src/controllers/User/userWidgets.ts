import { Request, Response } from 'express';
import {UserModel, IUser} from '../../models/user';
import { IWidget, WidgetModel } from '../../models/widgets';

export const addWidget = async (req:Request, res: Response) => {
  const {widgetId} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const widget: IWidget | null = await WidgetModel.findById(widgetId);
    const user: IUser | null = await UserModel.findOne({token : parsedToken});

    if (!widget)
      return res.status(400).json({error: 'This widget doesn\'t exist'});
    if (!user)
      return res.status(400).json({error: 'This user doesn\'t exist'});
    const newUserWidget = await WidgetModel.create({
      widgetName: widget.widgetName,
      widgetDesc: widget.widgetDesc,
      settings: widget.settings
    });
    user.userWidgets.push(newUserWidget._id);
    user.save();
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const removeWidget = async (req:Request, res: Response) => {
  const {widgetId} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const widget: IWidget | null = await WidgetModel.findById(widgetId);
    const user: IUser | null = await UserModel.findOne({token : parsedToken});

    if (!widget)
      return res.status(400).json({error: 'This widget doesn\'t exist'});
    if (!user)
      return res.status(400).json({error: 'This user doesn\'t exist'});
    const index = user.userWidgets.indexOf(widgetId);
    if (index == -1)
      return res.status(400).json({error: 'This user didn\'t add this widget.'});
    user.userWidgets.splice(index, 1);
    user.save();
    await WidgetModel.findByIdAndDelete(widgetId);
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserWidgets = async (req: Request, res: Response) => {
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token : parsedToken});
    const widgets: Array<IWidget> = await WidgetModel.find({
      '_id': { $in:user?.userWidgets}
    });
    res.status(200).json({
      status: 'success',
      data: widgets
    });
  } catch (error) {
    res.status(500).json(error);
  }
};