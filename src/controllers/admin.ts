import { Request, Response } from 'express';
import {UserModel, IUser} from '../models/user';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req: Request, res: Response) => {
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    if (!user)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (user.rank !== 'Admin')
      return res.status(400).json({error: 'User doesn\'t have permissions to perform this action.'});
    const users: Array<IUser> = await UserModel.find({});
    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);
  const {id} = req.body;

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    if (!user)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (user && user.rank !== 'Admin')
      return res.status(400).json({error: 'User doesn\'t have permissions to perform this action.'});
    const searchedUser: IUser | null = await UserModel.findById(id);
    if (!searchedUser)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    res.status(200).json({
      status: 'success',
      data: searchedUser
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteUserById = async (req:Request, res: Response) => {
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);
  const {id} = req.body;

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    if (!user)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (user && user.rank !== 'Admin')
      return res.status(400).json({error: 'User doesn\'t have permissions to perform this action.'});
    const deletedUser: IUser | null = await UserModel.findById(id);
    if (!deletedUser)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    await UserModel.findByIdAndRemove(deletedUser._id);
    res.status(200).json({
      status: 'success',
      message : 'User has been deleted.'
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const verifyEmailById = async (req:Request, res:Response) => {
  const {id, status} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    let editedUser: IUser | null = await UserModel.findById(id);

    if (!user || !editedUser)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (user && user.rank !== 'Admin')
      return res.status(400).json({error: 'User doesn\'t have permissions to perform this action.'});
    editedUser = await UserModel.findOneAndUpdate({_id:id}, {$set: {verifiedEmail : status}}, {
      runValidators: true,
      new: true
    });
    res.status(200).json({
      status: 'success',
      data : editedUser
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const editUserById = async (req:Request, res: Response) => {
  const {id, email, password, confirmPassword, firstName, lastName, rank} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    const userCheck: IUser | null = await UserModel.findOne({email: email});
    let editedUser: IUser | null = await UserModel.findById(id);

    if (!user || !editedUser)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (user && user.rank !== 'Admin')
      return res.status(400).json({error: 'User doesn\'t have permissions to perform this action.'});
    if (password !== confirmPassword)
      return res.status(400).json({error: 'Passwords must match.'});
    if (userCheck && (userCheck.email === email && userCheck._id != id))
      return res.status(400).json({error: 'This email is already used.'});

    editedUser = await UserModel.findOneAndUpdate({_id:editedUser._id}, {$set: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      rank: rank,
    }}, {returnOriginal: false});
    if (password && (password !== editedUser?.password)) {
      const hashedPassword: string = await bcrypt.hash(password, 10);
      editedUser = await UserModel.findOneAndUpdate({_id:editedUser?._id}, {$set: {password : hashedPassword}}, {returnOriginal: false});
    } else if (editedUser?.email !== email)
      editedUser = await UserModel.findOneAndUpdate({_id:editedUser?._id}, {$set: {verifiedEmail : false}}, {returnOriginal: false});

    res.status(200).json({
      status: 'success',
      data: editedUser
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const editRankById = async (req:Request, res: Response) => {
  const {id, rank} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    let editedUser: IUser | null = await UserModel.findById(id);

    if (!user || !editedUser)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (user && user.rank !== 'Admin')
      return res.status(400).json({error: 'User doesn\'t have permissions to perform this action.'});

    editedUser = await UserModel.findOneAndUpdate({_id:editedUser._id}, {$set: {
      rank: rank,
    }}, {returnOriginal: false});

    res.status(200).json({
      status: 'success',
      data: editedUser
    });
  } catch (error) {
    res.status(500).json(error);
  }
};