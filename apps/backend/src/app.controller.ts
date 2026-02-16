import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import {
  User as UserModel,
  Restaurant as RestaurantModel,
  MenuItem as MenuItemModal,
  Role,
  Country,
} from '@prisma/client';
import { AuthGuard } from './auth/auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly appService: AppService,
  ) {}

  @Post('user')
  async signupUser(
    @Body()
    userData: {
      name: string;
      email: string;
      password: string;
      role: Role;
      country: Country;
    },
  ): Promise<UserModel> {
    return await this.userService.createUser(userData);
  }

  @UseGuards(AuthGuard)
  @Get('restaurants')
  async getRestaurants(@Request() req): Promise<RestaurantModel[]> {
    return await this.appService.restaurants({
      role: req.user.role,
      country: req.user.country,
    });
  }

  @UseGuards(AuthGuard)
  @Get('restaurant/menu/:restId')
  async getMenuItems(
    @Param('restId') restId: string
  ): Promise<MenuItemModal[]> {
    return await this.appService.menuItems(restId);
  }
}
