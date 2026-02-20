import axios from "axios";
import { ActiveCartType, GroupedPaymentMethods, MenuItem, PaymentMethod, Restaurant } from "./types";

export const getRestaurants = async (access_token: string) => {
  try {
    const resp = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL! + `/restaurants`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const data = resp.data as [
      {
        id: string;
        name: string;
        country: "INDIA" | "AMERICA";
        createdAt: string;
      },
    ];
    const restaurants = data.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      country: restaurant.country,
    }));

    return restaurants;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server Error";
    console.log(errorMessage);
    return null;
  }
};

export const getPaymentMethods = async (
  access_token: string,
): Promise<GroupedPaymentMethods | null> => {
  try {
    const resp = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL! + `/payment-methods`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return resp.data as GroupedPaymentMethods;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server Error";
    console.log(errorMessage);
    return null;
  }
};

export const getMenuItems = async ({restId, access_token}: {restId: string, access_token: string}) => {
  try {
    const resp = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL! + `/restaurant/menu/${restId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return resp.data as MenuItem[];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server Error";
    console.log(errorMessage);
    return null;
  }
}

export const getActiveCarts = async ({ access_token, restId}: {access_token: string, restId: string}) => {
  try {
    const resp = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL! + `/restaurant/carts/${restId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return resp.data as ActiveCartType[];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server Error";
    console.log(errorMessage);
    return [];
  }
}

export const createOrder = async ({access_token, item, orderId, restId}: {access_token: string, restId: string, item: {
  name: string,
  itemId: string,
  price: number,
  quantity: number
}, orderId: string | null}) => {
  try {
    const resp = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL! + `/create-order`,
      {
        restId,
        item,
        orderId
      }, {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      }
    )

    return resp.data as ActiveCartType;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server Error";
    console.log(errorMessage);
    return null;
  }
}

export const getOrderByOrderId = async (access_token: string, orderId: string) =>  {
  try {
    const resp = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL! + `/cart/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return resp.data as ActiveCartType;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server Error";
    console.log(errorMessage);
    return null;
  }
}

export const updatePaymentMethod = async ({access_token, last4, type}:{access_token: string, last4: string, type: "UPI" | "NETBANKING" | "CARD"}) => {
  try {
    const resp = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL! + `/update-payment-method`,
      {
        last4,
        paymentType: type
      }, {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      }
    )

    return resp.data as PaymentMethod;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server Error";
    console.log(errorMessage);
    return null;
  }
}

export const placeOrder = async ({access_token, restId, paymentMethodId, orderId}:{access_token: string, restId: string, paymentMethodId: string, orderId: string}) => {
  try {
    const resp = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL! + `/place-order`,
      {
        restId,
        paymentMethodId,
        orderId
      }, {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      }
    )

    return resp.data as PaymentMethod;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server Error";
    console.log(errorMessage);
    return null;
  }
}