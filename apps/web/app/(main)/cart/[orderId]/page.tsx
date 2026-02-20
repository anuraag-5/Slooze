"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { getOrderByOrderId } from "@/lib/app";
import { ActiveCartType } from "@/lib/types";
import { use, useEffect, useState } from "react";

const CartPage = ({params}: {params: Promise<{orderId: string}>}) => {
  const { orderId } = use(params);
  const [cart, setCart] = useState<ActiveCartType | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if(!access_token) return;
    const getCartOrder = async () => {
        const cart = await getOrderByOrderId(access_token, orderId);
        return cart;
    }
    getCartOrder().then((c) => setCart(c)).finally(() => setLoading(false));
  }, [orderId])

  if(loading) {
    return <LoadingSpinner />
  }

  return (
    <section className="flex-1 bg-red-300">
        
    </section>
  )
}

export default CartPage