import axios from "axios";
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  role: string,
  country: string
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  getUser: (jwt: string) => Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    country: string;
  }>;
  clearUser: () => void;
  clearAll: () => void;
};

const getActualUser = async (access_token: string) => {
  const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL! + "/user", {
    headers: {
      "Authorization": `Bearer ${access_token}`
    },
  });

  const data = (await res.data) as {
    id: string;
    name: string;
    email: string;
    role: string;
    country: string;
  };

  return data;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  getUser: async (access_token) => await getActualUser(access_token),
  clearUser: () => set({ user: null }),
  clearAll: () => set({ user: null })
}));