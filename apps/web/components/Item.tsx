"use client";

import { OrderItem } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import ItemCard from "./ItemCard";
import { useUserStore } from "@/lib/userstore";

const Item = ({
  cartItem,
  restId,
  orderId,
}: {
  cartItem: OrderItem;
  restId: string;
  orderId: string;
}) => {
  const [deleteItem, setDeleteItem] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const { setActiveCarts, getActiveCarts } = useUserStore();
  return (
    <>
      {deleteItem ? null : (
        <div className="h-[80px] w-full max-w-[600px] p-3 rounded-2xl flex justify-between items-center bg-white">
          <div className="flex gap-2 h-full w-[50px] relative">
            <Image
              src={
                cartItem.name === "Butter Chicken"
                  ? "/butter-chicken.png"
                  : cartItem.name === "Paneer Tikka"
                    ? "/paneer-tikka.png"
                    : cartItem.name === "Cheeseburger"
                      ? "/cheeseburger.png"
                      : "/pepproni-pizza.png"
              }
              alt={cartItem.name}
              fill
              className="rounded-md object-cover"
            />
            <div className="flex flex-col justify-between text-sm relative left-15 min-w-[180px] my-2">
              <div className="font-semibold">{cartItem.name}</div>
              <div className="font-light text-xs">Serves 1</div>
            </div>
          </div>
          <ItemCard
            quantity={quantity}
            setQuantity={setQuantity}
            restId={restId}
            orderId={orderId}
            cartItem={cartItem}
            setActiveCarts={setActiveCarts}
            getActiveCarts={getActiveCarts}
            setDeleteItem={setDeleteItem}
          />
        </div>
      )}
    </>
  );
};

export default Item;
