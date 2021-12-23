import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/_helpers/PublicRoute';
import { RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GithubGuard } from './guards/github.guard';
import { GoogleGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }

  @Public()
  @Get('authenticate')
  async authenticate(@Headers('authorization') header: string) {
    return this.authService.authenticateToken(header);
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google')
  async googleAuth() {}

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallbackAuth(@Request() req) {
    return this.authService.googleCallback(req);
  }

  @Public()
  @UseGuards(GithubGuard)
  @Get('github')
  async githubAuth(@Request() req) {}

  @Public()
  @UseGuards(GithubGuard)
  @Get('github/callback')
  async githubCallbackAuth(@Request() req, @Response() res) {
    return this.authService.githubCallback(req, res);
  }
}
