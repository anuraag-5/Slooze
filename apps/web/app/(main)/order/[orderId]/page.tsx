"use client";

import { numanFont } from "@/app/fonts";
import Item from "@/components/Item";
import LoadingSpinner from "@/components/LoadingSpinner";
import { cancelOrder, getOrderByOrderIdPlaced } from "@/lib/app";
import { signOutUser } from "@/lib/auth";
import { PlacedOrderType } from "@/lib/types";
import { useUserStore } from "@/lib/userstore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const OrderPage = () => {
  const params = useParams();
  const orderId = params?.orderId as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<PlacedOrderType | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token || !orderId) {
      return;
    }

    const getOrder = async () => {
      const order = await getOrderByOrderIdPlaced(access_token, orderId);
      return order;
    };

    getOrder()
      .then((po) => setOrder(po))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCancel = async () => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      return;
    }
    await cancelOrder({ access_token, orderId });
    router.replace(`/orders/${order?.restId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 flex flex-col items-center gap-4 p-4">
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
      <div className="text-xl font-semibold">Order Status: {order?.status}</div>

      {order &&
        order.orderItems.map((oi) => (
          <Item
            key={oi.id}
            isCart={false}
            cartItem={oi}
            orderId={orderId}
            restId={order.restId}
          />
        ))}

      {/* Cancel Button */}
      {user?.role !== "MEMBER" ?  (
        <button
          onClick={handleCancel}
          className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Cancel Order
        </button>
      ): (
        <button
          className="mt-6 text-sm px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition cursor-not-allowed"
          disabled
        >
          Member can't cancel order
        </button>
      )}
    </div>
  );
};

export default OrderPage;
