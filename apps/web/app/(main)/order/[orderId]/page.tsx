"use client";

import Item from "@/components/Item";
import LoadingSpinner from "@/components/LoadingSpinner";
import { cancelOrder, getOrderByOrderIdPlaced } from "@/lib/app";
import { PlacedOrderType } from "@/lib/types";
import { useUserStore } from "@/lib/userstore";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const OrderPage = ({ params }: { params: Promise<{ orderId: string }> }) => {
  const { orderId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<PlacedOrderType | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
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
    await cancelOrder({access_token, orderId})
    router.replace(`/orders/${order?.restId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 flex flex-col items-center gap-4 p-4">
      <div className="text-xl font-semibold">
        Order Status: {order?.status}
      </div>

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
      {user?.role !== "MEMBER" && (
        <button
          onClick={handleCancel}
          className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderPage;