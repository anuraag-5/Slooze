"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/userstore";

const MainLayout = ({children} : {children: React.ReactNode}) => {
  const store = useUserStore();
  const router = useRouter();
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if(!access_token) {
        return router.replace("/login");
    }
    const getUser = async () => {
        const user = await store.getUser(access_token);
        return user;
    }
    getUser().then((u) => store.setUser(u))
  }, [])
  return (
    <div>
        {children}
    </div>
  )
}

export default MainLayout