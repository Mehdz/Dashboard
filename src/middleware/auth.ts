import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();


const auth = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.headers.authorization || '';
  const secret: string = process.env.SECRET_JWT || '';

  if (!token)
    return res.status(400).json({error: 'A token is required for authentication.', token: token});
  else if (!token.startsWith('Bearer '))
    return res.status(400).json({error: 'Wrong token.'});
  try {
    const parsedToken = token.substring(7, token.length);
    jwt.verify(parsedToken, secret);
    return next();
  } catch (error) {
    res.status(500).json(error);
  }
};

export default auth;