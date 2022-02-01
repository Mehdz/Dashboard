import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {UserModel, IUser} from '../../models/user';

const secret: string = process.env.SECRET_JWT || '';

export const signin = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  try {
    let user: IUser | null = await UserModel.findOne({email});

    if (user) {
      const validPassword: boolean = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token: string = jwt.sign({id: user._id, email}, secret, {expiresIn: '1d'});
        user = await UserModel.findOneAndUpdate({_id:user._id}, {$set: {token: token}}, {returnOriginal: false});
        res.status(200).json({
          status: 'success',
          data: user,
          token
        });
      } else {
        return res.status(400).json({error:'Invalid password.'});
      }
    } else {
      if (!user)
        return res.status(404).json({error: 'User doesn\'t exist.'});
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const signinOAuth = async (req: Request, res: Response) => {
  const {email} = req.body;

  try {
    let user: IUser | null = await UserModel.findOne({email});

    if (user) {
      const token: string = jwt.sign({id: user._id, email}, secret, {expiresIn: '1d'});
      user = await UserModel.findOneAndUpdate({_id:user._id}, {$set: {token: token}}, {returnOriginal: false});

      res.status(200).json({
        status: 'success',
        data: user,
        token
      });
    } else {
      if (!user)
        return res.status(404).json({error: 'User doesn\'t exist.'});
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const signup = async (req: Request, res: Response) => {
  const {email, password, confirmPassword, firstName, lastName} = req.body;

  try {
    const checkUser: IUser | null = await UserModel.findOne({email});

    if (checkUser)
      return res.status(400).json({error: 'User already exists.'});
    else if (password !== confirmPassword)
      return res.status(400).json({error: 'Passwords must match.'});
    const hashedPassword: string = await bcrypt.hash(password, 10);
    let user: IUser | null = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      email: email
    });
    const token: string = jwt.sign({id: user._id, email}, secret, {expiresIn: '1d'});

    if (user)
      user = await UserModel.findOneAndUpdate({_id:user._id}, {$set: {token: token}}, {returnOriginal: false});

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const signupOAuth = async (req: Request, res: Response) => {
  const {email, firstName, lastName} = req.body;

  try {
    const checkUser: IUser | null = await UserModel.findOne({email});

    if (checkUser)
      return res.status(400).json({error: 'User already exists.'});
    let user: IUser | null= await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email
    });
    const token = jwt.sign({id: user._id, email}, secret, {expiresIn: '1d'});

    if (user)
      user = await UserModel.findOneAndUpdate({_id:user._id}, {$set: {token: token}}, {returnOriginal: false});

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};