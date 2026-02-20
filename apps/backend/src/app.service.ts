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
      const restaurants = await this.prisma.restaurant.findMany();
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
    orderId,
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
    orderId: string | null;
  }): Promise<
    | Prisma.OrderGetPayload<{
        include: { orderItems: true };
      }>
    | undefined
  > {
    let order = orderId
      ? await this.activeOrderDraft({ userId: null, restId, orderId: orderId })
      : await this.activeOrderDraft({ userId: userId, restId, orderId: null });
    if (!order && !orderId) {
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
    } else if (!order) {
      throw new BadRequestException();
    }
    const existingItem = order.orderItems.find(
      (oi) => oi.menuItemId === item.itemId,
    );
    if (existingItem && item.quantity === 0) {
      await this.prisma.orderItem.delete({
        where: { id: existingItem.id },
      });
    } else if (existingItem && item.quantity !== 0) {
      await this.prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: item.quantity,
        },
      });
    } else if (!existingItem && item.quantity === 0) {
      return;
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
    orderId,
  }: {
    userId: string | null;
    restId: string;
    orderId: string | null;
  }): Promise<Prisma.OrderGetPayload<{
    include: { orderItems: true };
  }> | null> {
    if (userId) {
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
    return await this.prisma.order.findFirst({
      where: {
        id: orderId!,
        restId,
        status: OrderStatus.DRAFT,
      },
      include: {
        orderItems: true,
      },
    });
  }

  async getOrderByOrderId({
    orderId,
  }: {
    orderId: string;
  }): Promise<Prisma.OrderGetPayload<{
    include: { orderItems: true };
  }> | null> {
    return await this.prisma.order.findFirst({
      where: {
        id: orderId,
        status: OrderStatus.DRAFT,
      },
      include: {
        orderItems: true,
        user: true,
      },
    });
  }

  async getAllActiveDrafts({ restId }: { restId: string }): Promise<
    | Prisma.OrderGetPayload<{
        include: { orderItems: true; user: true };
      }>[]
    | null
  > {
    return await this.prisma.order.findMany({
      where: {
        restId,
        status: OrderStatus.DRAFT,
      },
      include: {
        orderItems: true,
        user: true,
      },
    });
  }

  async executeOrder({
    restId,
    orderId,
    paymentMethodId,
  }: {
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

  async addPaymentMethod({
    paymentType,
    last4,
  }: {
    paymentType: PaymentType;
    last4: string;
  }): Promise<PaymentMethodModal> {
    return await this.prisma.paymentMethod.create({
      data: {
        type: paymentType,
        last4,
      },
    });
  }

  async cancelOrder({ orderId }: { orderId: string; restId: string }) {
    await this.prisma.order.delete({
      where: {
        id: orderId,
      },
    });
  }

  async getAllPaymentMethods(): Promise<
    Record<PaymentType, PaymentMethodModal[]>
  > {
    const methods = await this.prisma.paymentMethod.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const grouped = methods.reduce(
      (acc, method) => {
        if (!acc[method.type]) {
          acc[method.type] = [];
        }

        acc[method.type].push(method);
        return acc;
      },
      {} as Record<PaymentType, PaymentMethodModal[]>,
    );

    return grouped;
  }
}
