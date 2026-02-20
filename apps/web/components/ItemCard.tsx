"use client";

import { createOrder } from "@/lib/app";
import useDebouncedQuantity from "@/lib/hooks";
import { ActiveCartType, OrderItem } from "@/lib/types";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

const ItemCard = ({
  quantity,
  cartItem,
  restId,
  setQuantity,
  orderId,
  setActiveCarts,
  getActiveCarts,
  setDeleteItem,
}: {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  cartItem: OrderItem;
  restId: string;
  orderId: string;
  setActiveCarts: (carts: ActiveCartType[] | null) => void;
  getActiveCarts: (
    restId: string,
    access_token: string,
  ) => Promise<ActiveCartType[]>;
  setDeleteItem: Dispatch<SetStateAction<boolean>>;
}) => {
  const debouncedQty = useDebouncedQuantity(quantity, 650);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) return;
    const updateCart = async () => {
      await createOrder({
        access_token,
        restId,
        item: {
          name: cartItem.name,
          itemId: cartItem.menuItemId,
          price: Number(cartItem.price),
          quantity: debouncedQty,
        },
        orderId: orderId,
      });
    };
    updateCart()
      .then(async () => {
        const updatedCarts = await getActiveCarts(restId, access_token);
        setActiveCarts(updatedCarts);
      })
      .finally(() => {
        if (debouncedQty === 0) setDeleteItem(true);
      });
  }, [debouncedQty]);
  const handleQuantityDecrease = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setQuantity((prev) => {
      if (prev <= 0) return 0;
      return prev - 1;
    });
  };
  const handleQuantityIncrease = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };
  return (
    <div className="flex gap-6 w-fit items-center">
      <div
        className="text-lg md:text-2xl text-white px-4 py-1 rounded-full bg-[#6750A4] cursor-pointer"
        onClick={(e) => handleQuantityDecrease(e)}
      >
        -
      </div>
      <div>{quantity}</div>
      <div
        className="text-lg md:text-2xl text-white px-4 py-1 rounded-full bg-[#6750A4] cursor-pointer"
        onClick={(e) => handleQuantityIncrease(e)}
      >
        +
      </div>
    </div>
  );
};

export default ItemCard;
