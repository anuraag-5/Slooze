export interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export type Restaurant = {
  id: string;
  name: string;
  country: "INDIA" | "AMERICA";
};

export type PaymentMethod = {
  id: string;
  last4: string;
  type: "CARD" | "NETBANKING" | "UPI";
  createdAt: string;
};

export type GroupedPaymentMethods = {
  CARD: PaymentMethod[];
  NETBANKING: PaymentMethod[];
  UPI: PaymentMethod[];
};

export type MenuItem = {
  id: string;
  price: number;
  name: string;
  createdAt: Date;
  restaurantId: string;
};

export type ActiveCartType = {
  id: string;
  userId: string;
  restId: string;
  country: "INDIA" | "AMERICA";
  status: "DRAFT" | "CANCELLED" | "PAID" | "CREATED";
  paymentMethodId: string | null;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;

  orderItems: {
    id: string;
    orderId: string;
    menuItemId: string;
    name: string;
    quantity: number;
    price: string;
  }[];

  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "MEMBER" | "MANAGER";
    country: "INDIA" | "AMERICA";
    createdAt: string;
    updatedAt: string;
  };
};

export type PlacedOrderType = {
  id: string;
  userId: string;
  restId: string;
  country: "INDIA" | "AMERICA";
  status: "PAID";
  paymentMethodId: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string;

  orderItems: {
    id: string;
    orderId: string;
    menuItemId: string;
    name: string;
    quantity: number;
    price: string;
  }[];

  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "MEMBER" | "MANAGER";
    country: "INDIA" | "AMERICA";
    createdAt: string;
    updatedAt: string;
  };

  restaurant: {
    id: string;
    name: string;
    country: "AMERICA" | "INDIA";
    createdAt: string;
  };
};

export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: string;
};
