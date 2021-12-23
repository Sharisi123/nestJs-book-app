import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDocument } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './auth.dto';
import generateToken from '../_helpers/generateToken';
const url = require('url');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel('users') private usersModel: Model<UsersDocument>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const result = bcrypt.compare(pass, user.password);

    if (result) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerData: RegisterDto) {
    const { password, username } = registerData;

    const result = await this.usersModel.findOne({ username });
    if (result)
      throw new HttpException('this username already exist', HttpStatus.OK);

    const hash = await bcrypt.hash(password, 10);

    await this.usersModel.create({
      ...registerData,
      username,
      password: hash,
    });
    return new HttpException('User created', HttpStatus.CREATED);
  }

  async authenticateToken(authHeader: string) {
    console.log('sapdpsadpaspdpspdpfpkvodkokdok');
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) throw new UnauthorizedException();

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);

    if (decoded) {
      const user = await this.usersModel.findById({ _id: decoded.id });
      if (user) {
        return user;
      }
    }
  }

  async googleCallback(req) {
    console.log('logloglog', req.user);
    return req.user;
  }

  async githubCallback(req, res) {
    const { user } = req;
    if (user) {
      const id = user._doc._id.toString();
      const token = generateToken({ id });

      return res.redirect(
        url.format({
          pathname: `${process.env.REACT_APP_HOST}/checkUser`,
          query: { token },
        }),
      );
    } else {
      return 'server error';
    }
  }
}
