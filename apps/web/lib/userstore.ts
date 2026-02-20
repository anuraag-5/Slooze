import axios from "axios";
import { create } from "zustand";
import { PaymentMethod, ActiveCartType } from "./types";
import { getPaymentMethods } from "./app";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  country: "INDIA" | "AMERICA";
};

type UserStore = {
  user: User | null;
  paymentMethods: PaymentMethod[] | null;
  activeCarts: ActiveCartType[] | null;

  setUser: (user: User) => void;
  getUser: (access_token: string) => Promise<User>;

  setPaymentMethods: (paymentMethods: PaymentMethod[] | null) => void;
  getPaymentMethods: (access_token: string) => Promise<PaymentMethod[] | null>;

  setActiveCarts: (carts: ActiveCartType[] | null) => void;
  getActiveCarts: (restId: string, access_token: string) => Promise<ActiveCartType[]>;

  clearUser: () => void;
  clearPaymentMethods: () => void;
  clearActiveCarts: () => void;
  clearAll: () => void;
};

const getActualUser = async (access_token: string): Promise<User> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      localStorage.removeItem("access_token");
    }
    throw error;
  }
};

const getActualPaymentMethods = async (access_token: string) => {
  return await getPaymentMethods(access_token);
};

const getActualActiveCarts = async (
  restId: string,
  access_token: string
): Promise<ActiveCartType[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/restaurant/carts/${restId}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  return res.data;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  paymentMethods: null,
  activeCarts: null,

  setUser: (user) => set({ user }),

  getUser: async (access_token) => {
    return await getActualUser(access_token);
  },

  setPaymentMethods: (paymentMethods) =>
    set({ paymentMethods }),

  getPaymentMethods: async (access_token) => {
    return await getActualPaymentMethods(access_token);
  },

  setActiveCarts: (carts) =>
    set({ activeCarts: carts }),

  getActiveCarts: async (restId, access_token) => {
    return await getActualActiveCarts(restId, access_token);
  },

  clearUser: () => set({ user: null }),

  clearPaymentMethods: () =>
    set({ paymentMethods: null }),

  clearActiveCarts: () =>
    set({ activeCarts: null }),

  clearAll: () =>
    set({
      user: null,
      paymentMethods: null,
      activeCarts: null,
    }),
}));