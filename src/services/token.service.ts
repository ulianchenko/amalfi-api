import jwt, { JwtPayload } from 'jsonwebtoken';
import Token from '../models/Token';
import config from 'config';


const token = () => {
  // const accessSecret = 'super secret from backend';
  // const refreshSecret = 'super refresh key';

  const generate = (payload: {_id: string}) => {
    // const accessToken = jwt.sign(payload, config.get('ACCESS_SECRET'), { expiresIn: '1h' });
    // const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '1h' });
    // const accessToken = jwt.sign(payload, config.get('ACCESS_SECRET') || '', { expiresIn: '1h' });
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET || '', { expiresIn: '1h' });

    // const refreshToken = jwt.sign(payload, config.get('REFRESH_SECRET'));
    // const refreshToken = jwt.sign(payload, refreshSecret);
    // const refreshToken = jwt.sign(payload, config.get('REFRESH_SECRET') || '');
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET || '');

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }

  const save = async (userId: string, refreshToken: string) => {
    const data = await Token.findOne({ user: userId });
    if (data) {
      data.refreshToken = refreshToken;
      return data.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
    return token;
  }

  const validateRefresh = (refreshToken: string): string |JwtPayload | null => {
    try {
      // return jwt.verify(refreshToken, config.get('REFRESH_SECRET'));
      // return jwt.verify(refreshToken, refreshSecret);
      // const data = jwt.verify(refreshToken, config.get('REFRESH_SECRET') || '');
      return jwt.verify(refreshToken, process.env.REFRESH_SECRET || '');
      // return data;
    } catch (error) {
      return null;
    }
  }

  const validateAccess = (accessToken: string) => {
    try {
      // return jwt.verify(accessToken, config.get('ACCESS_SECRET'));
      // return jwt.verify(accessToken, accessSecret);
      // return jwt.verify(accessToken, config.get('ACCESS_SECRET') || '');
      return jwt.verify(accessToken, process.env.ACCESS_SECRET || '');
    } catch (error) {
      return null;
    }
  }
  // const validateAccess = (accessToken: any): any => {
  //   return accessToken;
  // }

  const findToken = async (refreshToken: string) => {
    try {
      return await Token.findOne({ refreshToken });
    } catch (error) {
      return null;
    }
  }

  return { generate, save, validateRefresh, validateAccess, findToken };
}

const tokenService = {
  generate: token().generate,
  save: token().save,
  validateRefresh: token().validateRefresh,
  validateAccess: token().validateAccess,
  findToken: token().findToken,
};

export default tokenService;