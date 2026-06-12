import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

interface JwtPayload {
  sub: string;
  id: string;
  email: string;
}

export const signToken = (payload: { id: string; email: string }): string => {
  return jwt.sign(
    { sub: payload.id, ...payload },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
