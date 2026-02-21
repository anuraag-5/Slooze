"use client";

import * as motion from "motion/react-client";
import LoadingSpinner from "@/components/LoadingSpinner";
import MenuItems from "@/components/MenuItems";
import Navbar from "@/components/Navbar";
import Settings from "@/components/Settings";
import { getMenuItems } from "@/lib/app";
import { MenuItem } from "@/lib/types";
import { useUserStore } from "@/lib/userstore";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const MenuPage = () => {
  const params = useParams();
  const restId = params?.restId as string;
  const router = useRouter();
  const search = useSearchParams();
  const orderId = search.get("orderId");
  const { user, activeCarts, setActiveCarts, getActiveCarts } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>([]);
  const [currentTab, setCurrenTab] = useState("menu");
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      return;
    }
    const getMenu = async () => {
      const menuItems = await getMenuItems({ restId, access_token });
      return menuItems;
    };
    const getAc = async () => {
      const carts = await getActiveCarts(restId, access_token);
      return carts;
    };
    getMenu()
      .then((m) => setMenuItems(m))
      .finally(() => setLoading(false));
    getAc().then((c) => setActiveCarts(c));
  }, [restId, orderId]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col flex-1">
        <Navbar
          path="menu"
          currentTab={currentTab}
          setCurrentTab={setCurrenTab}
        />
        {currentTab === "menu" ? (
          <MenuItems menuItems={menuItems} orderId={orderId} restId={restId} />
        ) : (
          <Settings />
        )}
        {activeCarts && activeCarts.length > 0 && currentTab === "menu" ? (
          <motion.div
            className="fixed bottom-8 left-0 w-full flex flex-col gap-4 items-center"
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            {activeCarts &&
              activeCarts.map((ac) => (
                <div
                  key={ac.id}
                  className="text-[#6750A4] bg-white w-full min-w-[280px] max-w-[500px] rounded-full flex justify-between py-3 px-5 items-center shadow-[0px_0px_28px_#6750A480] cursor-pointer"
                  onClick={() => router.push(`/cart/${ac.id}`)}
                >
                  <div className="flex flex-col gap-1">
                    <div className="text-sm">
                      {ac.orderItems.length + " items"}
                    </div>
                    <div className="text-xs text-black">
                      Created by:{" "}
                      <span>
                        {user && user.id === ac.userId
                          ? "You"
                          : ` ${ac.user.name} `}
                      </span>
                      <span className="text-[#6750A4]">
                        {" (" + ac.user.role + ") "}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-full py-2 px-4 bg-[#6750A4] text-white">
                    View Cart
                  </div>
                </div>
              ))}
          </motion.div>
        ) : null}
      </div>
    </AnimatePresence>
  );
};

export default MenuPage;
