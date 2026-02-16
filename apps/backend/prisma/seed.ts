import * as dotenv from 'dotenv';
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Role, Country, PaymentType } from "@prisma/client";

dotenv.config();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  const nick = await prisma.user.create({
    data: {
      name: "Nick Fury",
      email: "nick@slooze.com",
      password,
      role: Role.ADMIN,
      country: Country.INDIA,
    },
  });

  const captainMarvel = await prisma.user.create({
    data: {
      name: "Captain Marvel",
      email: "marvel@slooze.com",
      password,
      role: Role.MANAGER,
      country: Country.INDIA,
    },
  });

  const captainAmerica = await prisma.user.create({
    data: {
      name: "Captain America",
      email: "america@slooze.com",
      password,
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
  });

  const thanos = await prisma.user.create({
    data: {
      name: "Thanos",
      email: "thanos@slooze.com",
      password,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const thor = await prisma.user.create({
    data: {
      name: "Thor",
      email: "thor@slooze.com",
      password,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const travis = await prisma.user.create({
    data: {
      name: "Travis",
      email: "travis@slooze.com",
      password,
      role: Role.MEMBER,
      country: Country.AMERICA,
    },
  });

  const indiaRestaurant = await prisma.restaurant.create({
    data: {
      name: "Mumbai Bites",
      country: Country.INDIA,
    },
  });

  const americaRestaurant = await prisma.restaurant.create({
    data: {
      name: "New York Deli",
      country: Country.AMERICA,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        name: "Butter Chicken",
        price: 299.0,
        restaurantId: indiaRestaurant.id,
      },
      {
        name: "Paneer Tikka",
        price: 249.0,
        restaurantId: indiaRestaurant.id,
      },
      {
        name: "Cheeseburger",
        price: 12.99,
        restaurantId: americaRestaurant.id,
      },
      {
        name: "Pepperoni Pizza",
        price: 15.5,
        restaurantId: americaRestaurant.id,
      },
    ],
  });

  await prisma.paymentMethod.createMany({
  data: [
    {
      type: PaymentType.CARD,
      last4: "4242",
    },
    {
      type: PaymentType.UPI,
      last4: "8899",
    },
  ],
})

  console.log("✅ Seeding completed!");
  console.log("🔐 Default password for all users: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });