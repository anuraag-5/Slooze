
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User as UserModel, Role, Country } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService
  ) {}

  @Post('user')
  async signupUser(
    @Body() userData: { name: string; email: string, password: string, role: Role, country: Country },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}