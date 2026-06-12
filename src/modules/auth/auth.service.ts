import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { RegisterUserDto, LoginUserDto, AuthResponse } from './auth.types';

export const registerUser = async (
  dto: RegisterUserDto
): Promise<AuthResponse> => {
  const existing = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (existing) {
    throw new AppError('Email already exists', 409);
  }

  const hashedPassword = await hashPassword(dto.password);

  const user = await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return { user };
};

export const loginUser = async (dto: LoginUserDto): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await comparePassword(dto.password, user.password);

  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ id: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
