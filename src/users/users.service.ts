import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { NewBookDto } from './users.dto';
import { UsersDocument } from './schemas/users.schema';
import jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private usersModel: Model<UsersDocument>) {}

  async findOne(username: string): Promise<UsersDocument | null> {
    return this.usersModel.findOne({ username });
  }

  async getUsers(): Promise<UsersDocument[]> {
    try {
      const result = await this.usersModel.find({}, { username: 1 });
      return result;
    } catch (e) {
      if (e.message) {
        throw new InternalServerErrorException();
      }
      // logger.error(e);
      // res.status(500).send();
    }
  }

  async authenticateToken(authHeader: string): Promise<void> {
    if (!authHeader) throw new UnauthorizedException();

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    jwt.verify(
      token,
      process.env.TOKEN_SECRET as string,
      async (err: any, data: any) => {
        if (err) throw new ForbiddenException();

        if (data) {
          const user = await this.usersModel.findById({ _id: data.id });
          return user;
        }
      },
    );
  }
}
