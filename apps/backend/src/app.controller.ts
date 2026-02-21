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
  NotFoundException,
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
import { UserType } from 'types';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly appService: AppService,
  ) {}

  @Post('user')
  async signupUser(
    @Body()
    data: {
      name: string;
      email: string;
      password: string;
      country: Country;
    },
  ): Promise<UserModel> {
    const userData = {...data, role: Role.MEMBER}
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
      orderId: string | null;
    },
  ): Promise<
    Prisma.OrderGetPayload<{
      include: { orderItems: true };
    }> | undefined
  > {
    return await this.appService.createOrder({
      restId: orderData.restId,
      item: orderData.item,
      userId: req.user.sub,
      country: req.user.country,
      orderId: orderData.orderId,
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
      restId: data.restId,
      orderId: data.orderId,
      paymentMethodId: data.paymentMethodId,
    });
  }

  @UseGuards(AuthGuard)
  @Post('update-payment-method')
  async updatePaymentMethod(
    @Request() req,
    @Body()
    data: {
      paymentType: PaymentType;
      last4: string;
    },
  ): Promise<PaymentMethodModal> {
    if (req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can update payments method.');
    }
    return await this.appService.addPaymentMethod({
      paymentType: data.paymentType,
      last4: data.last4,
    });
  }

  @UseGuards(AuthGuard)
  @Post('cancel-order')
  async cancelOrder(
    @Request() req,
    @Body()
    data: {
      orderId: string
    },
  ) {
    if (req.user.role === Role.MEMBER) {
      throw new ForbiddenException('Members cannot cancel order');
    }

    return await this.appService.cancelOrder({
      orderId: data.orderId
    });
  }

  @UseGuards(AuthGuard)
  @Get('restaurant/carts/:restId')
  async listCarts(
    @Param('restId') restId: string,
  ){
    return await this.appService.getAllActiveDrafts({restId});
  }

  @UseGuards(AuthGuard)
  @Get('restaurant/orders/:restId')
  async getOrders(
    @Param('restId') restId: string,
  ){
    return await this.appService.getAllPlacedOrders({restId});
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getUser(
    @Request() req
  ): Promise<UserType> {
    const res =  await this.userService.user({id: req.user.sub})
    if(!res) {
      throw new NotFoundException();
    }

    return {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
      country: res.country
    }
  }

  @UseGuards(AuthGuard)
  @Get('/payment-methods')
  async getAllPaymentMethods() {
    return await this.appService.getAllPaymentMethods();
  }

  @UseGuards(AuthGuard)
  @Get('cart/:orderId')
  async getOrderByOrderId(
    @Param('orderId') orderId: string
  ) {
    return this.appService.getOrderByOrderId({orderId});
  }
}
