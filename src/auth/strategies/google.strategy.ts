import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersDocument } from 'src/users/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
require('dotenv').config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel('users') private usersModel: Model<UsersDocument>) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.NODE_APP_HOST}/auth/google/callback`,
      scope: ['profile'],
    });
  }

  findOrCreateUser = async (profile: any, callback: any) => {
    try {
      const result = await this.usersModel.findOne({
        username: String(profile._json.name).toLowerCase(),
      });

      if (!result) {
        const createdGoogleUser = await this.usersModel.create({
          provider: 'google',
          username: String(profile._json.name).toLowerCase(),
          email: 'test@mail.com',
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          role: 'Reader',
        });
        return callback(null, createdGoogleUser);
      } else {
        return callback(null, result);
      }
    } catch (err) {
      console.log(err.message);
      return callback(err.message, null);
    }
  };

  async validate(accessToken: any, refreshToken: any, profile: any, done: any) {
    this.findOrCreateUser(profile, (err: string, user: any) => {
      console.log(user);
      console.log('error', err);

      // if (err || !user) {
      //   return done(err, false);
      // }

      const payload = {
        accessToken,
        ...user,
      };

      return done(null, payload);
    });
  }
}
