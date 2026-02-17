import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import {
  Country,
  MenuItem as MenuItemModal,
  PaymentMethod as PaymentMethodModal,
  OrderStatus,
  PaymentType,
  Prisma,
  Restaurant as RestaurantModel,
  Role,
} from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async restaurants({
    role,
    country,
  }: {
    role: Role;
    country: Country;
  }): Promise<RestaurantModel[]> {
    const isAdmin = role === Role.ADMIN;

    if (isAdmin) {
      const restaurants = await await this.prisma.restaurant.findMany();
      return restaurants;
    }

    return await this.prisma.restaurant.findMany({
      where: {
        country,
      },
    });
  }

  async menuItems(restId: string): Promise<MenuItemModal[]> {
    return await this.prisma.menuItem.findMany({
      where: {
        restaurantId: restId,
      },
    });
  }

  async createOrder({
    restId,
    userId,
    item,
    country,
  }: {
    restId: string;
    userId: string;
    country: Country;
    item: {
      name: string;
      itemId: string;
      quantity: number;
      price: number;
    };
  }): Promise<
    Prisma.OrderGetPayload<{
      include: { orderItems: true };
    }>
  > {
    let order = await this.activeOrderDraft({ userId, restId });
    if (!order) {
      order = await this.prisma.order.create({
        data: {
          userId,
          restId,
          country,
          status: OrderStatus.DRAFT,
        },
        include: {
          orderItems: true,
        },
      });
    }
    const existingItem = order.orderItems.find(
      (oi) => oi.menuItemId === item.itemId,
    );
    if (existingItem) {
      await this.prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + item.quantity,
        },
      });
    } else {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          price: new Prisma.Decimal(item.price),
        },
      });
    }
    const updatedItems = await this.prisma.orderItem.findMany({
      where: { orderId: order.id },
    });
    const total = updatedItems.reduce((sum, oi) => {
      return sum + Number(oi.price) * oi.quantity;
    }, 0);
    return this.prisma.order.update({
      where: { id: order.id },
      data: {
        totalAmount: new Prisma.Decimal(total),
      },
      include: {
        orderItems: true,
      },
    });
  }

  async activeOrderDraft({
    userId,
    restId,
  }: {
    userId: string;
    restId: string;
  }): Promise<Prisma.OrderGetPayload<{
    include: { orderItems: true };
  }> | null> {
    return await this.prisma.order.findFirst({
      where: {
        userId,
        restId,
        status: OrderStatus.DRAFT,
      },
      include: {
        orderItems: true,
      },
    });
  }

  async executeOrder({
    userId,
    restId,
    orderId,
    paymentMethodId
  }: {
    userId: string;
    restId: string;
    orderId: string;
    paymentMethodId: string;
  }): Promise<
    Prisma.OrderGetPayload<{
      include: {
        orderItems: true;
        paymentMethod: true;
      };
    }>
  > {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        restId,
        status: OrderStatus.DRAFT,
      },
    });
    if (!order) {
      throw new BadRequestException('No active order found');
    }
    const completedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
        restId,
        userId,
      },
      data: {
        status: OrderStatus.PAID,
        paymentMethodId,
        paidAt: new Date(),
      },
      include: {
        orderItems: true,
        paymentMethod: true,
      },
    });

    return completedOrder;
  }

  async addPaymentMethod({paymentType, last4}: { paymentType: PaymentType, last4: string}): Promise<PaymentMethodModal>{
    return await this.prisma.paymentMethod.create({
      data: {
        type: paymentType,
        last4
      }
    })
  }
}
