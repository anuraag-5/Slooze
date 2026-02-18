"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/userstore";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const store = useUserStore();
  const router = useRouter();
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      return router.replace("/login");
    }
    const getUser = async () => {
      try {
        const user = await store.getUser(access_token);
        return user;
      } catch (error) {
        router.replace("/login");
        return null;
      }
    };
    getUser().then((u) => {
      if (u) {
        store.setUser(u);
      }
    });
  }, []);
  return (
    <section className="bg-[#E5DBFF] min-h-screen p-12">
      {children}
    </section>
  );
};

export default MainLayout;
