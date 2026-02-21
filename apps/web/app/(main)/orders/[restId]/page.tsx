"use client";

import * as motion from "motion/react-client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getAllPlacedOrders } from "@/lib/app";
import { PlacedOrderType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/userstore";
import Image from "next/image";
import { signOutUser } from "@/lib/auth";
import { numanFont } from "@/app/fonts";

const OrdersPage = ({ params }: { params: { restId: string }}) => {
  const { restId } = params;
  const router = useRouter();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [placedOrders, setPlacedOrders] = useState<PlacedOrderType[]>([]);
  console.log(placedOrders);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      return;
    }
    const getPlacedOrders = async () => {
      const placedOrders = await getAllPlacedOrders({ access_token, restId });
      return placedOrders;
    };

    getPlacedOrders()
      .then((po) => setPlacedOrders(po))
      .finally(() => setLoading(false));
  }, [restId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <div className="flex w-full justify-between">
        <div
          className={
            "text-lg md:text-2xl lg:text-4xl text-[#6750A4] cursor-pointer " +
            numanFont.className
          }
          onClick={() => router.push("/restaurants")}
        >
          Slooze
        </div>
        <div
          className="flex gap-4 items-center cursor-pointer"
          onClick={() => {
            signOutUser();
            router.replace("/login");
          }}
        >
          <div className="text-black hidden md:block">Log out</div>
          <Image src={"/logout-icon.svg"} width={28} height={28} alt="" />
        </div>
      </div>
      <div className="flex justify-between text-3xl font-bold my-8 w-[330px] md:w-[500px] items-center">
        <div>Your Orders</div>
        <div className="text-lg text-[#6750A4]">
          {placedOrders[0]?.restaurant.name}
        </div>
      </div>
      {placedOrders.length > 0 ? (
        placedOrders.map((po) => (
          <motion.div
            className=""
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
            key={po.id}
          >
            <div
              className="text-[#6750A4] bg-white w-[330px] md:w-[500px] rounded-2xl flex justify-between py-3 px-5 items-center shadow-[0px_0px_28px_#6750A480] cursor-pointer"
              onClick={() => router.push(`/order/${po.id}`)}
            >
              <div className="flex flex-col gap-1">
                <div className="text-sm">{po.orderItems.length + " items"}</div>
                <div className="text-xs text-black max-w-[180px] md:max-w-[250px]">
                  Created by:{" "}
                  <span>
                    {user && user.id === po.userId
                      ? "You"
                      : ` ${po.user.name} `}
                  </span>
                  <span className="text-[#6750A4]">
                    {" (" + po.user.role + ") "}
                  </span>
                </div>
              </div>
              <div
                className="rounded-full px-2 py-1 md:py-2 md:px-4 bg-[#6750A4] text-white 
                text-xs md:text-sm"
              >
                View order
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div>No Placed Orders</div>
      )}
    </div>
  );
};

export default OrdersPage;
export const dynamic = "force-dynamic";
