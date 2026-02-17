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
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import {
  User as UserModel,
  Restaurant as RestaurantModel,
  MenuItem as MenuItemModal,
  PaymentMethod as PaymentMethodModal,
  Role,
  Country,
  Prisma,
  PaymentType,
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
    @Param('restId') restId: string,
  ): Promise<MenuItemModal[]> {
    return await this.appService.menuItems(restId);
  }

  @UseGuards(AuthGuard)
  @Post('create-order')
  async createOrder(
    @Request() req,
    @Body()
    orderData: {
      restId: string;
      item: {
        name: string;
        price: number;
        quantity: number;
        itemId: string;
      };
    },
  ): Promise<
    Prisma.OrderGetPayload<{
      include: { orderItems: true };
    }>
  > {
    return await this.appService.createOrder({
      restId: orderData.restId,
      item: orderData.item,
      userId: req.user.sub,
      country: req.user.country,
    });
  }

  @UseGuards(AuthGuard)
  @Post('place-order')
  async placeOrder(
    @Request() req,
    @Body()
    data: {
      orderId: string;
      restId: string;
      paymentMethodId: string;
    },
  ): Promise<
    Prisma.OrderGetPayload<{
      include: {
        orderItems: true;
        paymentMethod: true;
      };
    }>
  > {
    if (req.user.role === Role.MEMBER) {
      throw new ForbiddenException();
    }
    return await this.appService.executeOrder({
      userId: req.user.sub,
      restId: data.restId,
      orderId: data.orderId,
      paymentMethodId: data.paymentMethodId
    });
  }

  @UseGuards(AuthGuard)
  @Post('update-payment-method')
  async updatePaymentMethod(
    @Request() req,
    @Body() data: {
      paymentType: PaymentType,
      last4: string
    }
  ): Promise<PaymentMethodModal>{
    if(req.user.role !== Role.ADMIN){
      throw new ForbiddenException("Only admins can update payments method.");
    }
    return await this.appService.addPaymentMethod({ paymentType: data.paymentType, last4: data.last4})
  }
}
