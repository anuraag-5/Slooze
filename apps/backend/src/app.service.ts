import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Country, MenuItem as MenuItemModal, Restaurant as RestaurantModel, Role } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async restaurants({ role, country }: { role: Role, country: Country }): Promise<RestaurantModel[]> {
    const isAdmin = role === Role.ADMIN;
    
    if(isAdmin){
      const restaurants = await this.prisma.restaurant.findMany();
      return restaurants;
    }

    return this.prisma.restaurant.findMany({
      where: {
        country
      }
    });
  }

  async menuItems(restId: string): Promise<MenuItemModal[]> {
    return this.prisma.menuItem.findMany({
      where: {
        restaurantId: restId
      }
    })
  }
}
