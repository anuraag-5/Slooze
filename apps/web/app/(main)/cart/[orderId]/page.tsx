"use client";

import Item from "@/components/Item";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getOrderByOrderId } from "@/lib/app";
import { ActiveCartType } from "@/lib/types";
import { useUserStore } from "@/lib/userstore";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const CartPage = ({params}: {params: Promise<{orderId: string}>}) => {
  const router = useRouter();
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
    <section className="flex-1 flex flex-col justify-start items-center gap-5">
      <div className="w-full text-center text-xl md:text-2xl lg:text-3xl mb-5">
        Your Cart
      </div>
        {
          cart && cart.orderItems.map((oi) => (
            <Item key={oi.id} cartItem={oi} restId={cart.restId} orderId={orderId}/>
          ))
        }
        <div 
        className="cursor-pointer"
        onClick={() => router.push(`/restaurants/${cart!.restId}?orderId=${cart?.id}`)}>Add more</div>
    </section>
  )
}

export default CartPage