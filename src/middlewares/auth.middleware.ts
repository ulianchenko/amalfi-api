import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import tokenService from '../services/token.service';


const auth =  async ( req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
  // if (req.method === 'OPTIONS') {
  //   next();
  // }

  try {
    const token: string = req.headers.authorization?.split(' ')[1] || '';
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const data: string | JwtPayload | null= tokenService.validateAccess(token);
    const currentUserData: IUser | null = await User.findById(data);

    req.body.user = data;
    req.body.userRole = currentUserData?.role || '';
    next();

  } catch (error) {
    res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

export default auth;
