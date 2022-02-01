import { Request, Response } from 'express';
import {WidgetModel, IWidget} from '../models/widgets';

export const createWidget = async (req: Request, res: Response) => {
  const {widgetName, widgetDesc, settings} = req.body;

  try {
    const widget = await WidgetModel.create({
      widgetName: widgetName,
      widgetDesc: widgetDesc || '',
      settings: settings,
    });
    res.status(200).json({
      status: 'success',
      data: widget
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const editWidget = async (req:Request, res: Response) => {
  const {id, widgetName, widgetDesc, settings} = req.body;

  try {
    let widget: IWidget | null = await WidgetModel.findById(id);

    if (!widget)
      return res.status(400).json({error: 'This widget doesn\'t exist'});

    await WidgetModel.findByIdAndUpdate(id, {$set: {
      widgetName: widgetName  || widget.widgetName,
      widgetDesc: widgetDesc || widget.widgetDesc,
      settings: settings || widget.settings,
    }}, {returnOriginal: false});
    widget = await WidgetModel.findById(id);

    res.status(200).json({
      status: 'success',
      data: widget
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteWidget = async (req:Request, res: Response) => {
  const {id} = req.body;

  try {
    const deletedWidget = await WidgetModel.findByIdAndRemove(id);

    if (!deletedWidget)
      return res.status(400).json({error: 'This widget doesn\'t exist.'});

    res.status(200).json({
      status: 'success',
      message: 'Widget has been deleted.'
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getWidget = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const widget: IWidget | null = await WidgetModel.findById(id);

    if (!widget)
      return res.status(400).json({error: 'This widget doesn\'t exist.'});
    res.status(200).json({
      status: 'success',
      widget
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllWidgets = async (req: Request, res: Response) => {
  try {
    const widgets: Array<IWidget> = await WidgetModel.find({});
    res.status(200).json({
      status: 'success',
      data: widgets
    });
  } catch (error) {
    res.status(500).json(error);
  }
};