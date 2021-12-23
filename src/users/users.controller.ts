import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
// import { UsersDto } from './users.dto';
import { UsersService } from './users.service';
import { UsersDocument } from './schemas/users.schema';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getusers(): Promise<UsersDocument[]> {
    return this.usersService.getUsers();
  }

  @Post('/authenticate')
  async authenticateToken(@Headers('authorization') header): Promise<void> {
    return this.usersService.authenticateToken(header);
  }

  // @Post('/login')
  // async passportLogin(@Headers('authorization') header): Promise<void> {
  //   return this.usersService.passportLogin(header);
  // }
}
