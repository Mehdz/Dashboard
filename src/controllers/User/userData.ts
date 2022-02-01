import { Request, Response } from 'express';
import {UserModel, IUser} from '../../models/user';
import bcrypt from 'bcryptjs';

export const getUser = async (req: Request, res: Response) => {
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});
    if (!user)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteUser = async (req:Request, res: Response) => {
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const deletedUser: IUser | null = await UserModel.findOne({token: parsedToken});

    if (!deletedUser)
      return res.status(400).json({error: 'User doesn\'t exist.'});

    await UserModel.findByIdAndDelete(deletedUser._id);
    res.status(200).json({
      status: 'success',
      message : 'User has been deleted.'
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getVerifiedStatus = async (req: Request, res: Response) => {
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    const user: IUser | null = await UserModel.findOne({token: parsedToken});

    if (!user)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    res.status(200).json({
      status: 'success',
      verifiedEmail: user.verifiedEmail,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const editUser = async (req:Request, res: Response) => {
  const {email, password, confirmPassword, firstName, lastName} = req.body;
  const token: string = req.headers.authorization || '';
  const parsedToken = token.substring(7, token.length);

  try {
    let user: IUser | null = await UserModel.findOne({token: parsedToken});
    const userCheck: IUser | null = await UserModel.findOne({email: email});

    if (!user)
      return res.status(400).json({error: 'User doesn\'t exist.'});
    if (password !== confirmPassword)
      return res.status(400).json({error: 'Passwords must match.'});
    if (userCheck?.email === email && userCheck?._id.toString() !== user._id.toString())
      return res.status(400).json({error: 'This email is already used.'});

    user = await UserModel.findOneAndUpdate({_id:user._id}, {$set: {
      firstName: firstName,
      lastName: lastName,
      email: email,
    }}, {returnOriginal: false});

    if (password && (password !== user?.password)) {
      const hashedPassword: string = await bcrypt.hash(password, 10);
      user = await UserModel.findOneAndUpdate({_id:user?._id}, {$set: {password : hashedPassword}}, {returnOriginal: false});
    } else if (user?.email !== email)
      user = await UserModel.findOneAndUpdate({_id:user?._id}, {$set: {verifiedEmail : false}}, {returnOriginal: false});

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
