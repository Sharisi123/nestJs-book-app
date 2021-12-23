import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersDocument } from 'src/users/schemas/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel('users') private usersModel: Model<UsersDocument>) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.NODE_APP_HOST}/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    try {
      const findResult = await this.usersModel.findOne({
        username: String(profile.username).toLowerCase(),
      });

      if (!findResult) {
        const createResult = await this.usersModel.create({
          provider: 'github',
          username: String(profile.username).toLowerCase(),
          email: 'test@test.com',
          firstName: profile._json.name.split(' ')[0],
          lastName: profile._json.name.split(' ')[1],
          role: 'Reader',
        });
        return done(null, {
          accessToken,
          ...createResult,
        });
      } else {
        return done(null, {
          accessToken,
          ...findResult,
        });
      }
    } catch (err) {
      console.log(err);
      return done(err.message, false);
    }
  }
}
