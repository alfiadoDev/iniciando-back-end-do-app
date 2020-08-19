import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';
import User from '../infra/typeorm/entities/User';

import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  email: string;

  password: string;
}

interface IResponse {
  user: User;

  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError('Incorrect email/password conbination', 401);

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched)
      throw new AppError('Incorrect email/password conbination', 401);

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expireIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;