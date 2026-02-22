"use client";

import * as motion from "motion/react-client";
import { createOrder } from "@/lib/app";
import { ActiveCartType, MenuItem } from "@/lib/types";
import useDebouncedQuantity from "@/lib/hooks";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useRef } from "react";
import { getDescriptionForMenu } from "@/lib/utils";
import { numanFont } from "@/app/fonts";
import Image from "next/image";

const MenuOpened = ({
  restId,
  menuItem,
  quantity,
  activeOrderId,
  setQuantity,
  setActiveCarts,
  getActiveCarts,
  onClose,
}: {
  restId: string;
  menuItem: MenuItem;
  quantity: number;
  activeOrderId: string | null;
  setQuantity: Dispatch<SetStateAction<number>>;
  setActiveCarts: (carts: ActiveCartType[] | null) => void;
  getActiveCarts: (
    restId: string,
    access_token: string,
  ) => Promise<ActiveCartType[]>;
  onClose: () => void;
}) => {
  const debouncedQty = useDebouncedQuantity(quantity, 500);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) return;
    const updateCart = async () => {
      await createOrder({
        access_token,
        restId,
        item: {
          name: menuItem.name,
          itemId: menuItem.id,
          price: menuItem.price,
          quantity: debouncedQty,
        },
        orderId: activeOrderId,
      });
    };
    updateCart().then(async () => {
      const updatedCarts = await getActiveCarts(restId, access_token);
      setActiveCarts(updatedCarts);
    });
  }, [debouncedQty]);
  const handleItemClose = () => {
    onClose();
  };
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
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={handleItemClose}
    >
      <motion.div
        className="relative bg-white w-[350px] md:w-[676px] h-[600px] rounded-2xl shadow-[0px_0px_28px_#6750A480] flex items-end md:items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div
          className="absolute right-8 top-5 cursor-pointer"
          onClick={() => handleItemClose()}
        >
          ❌
        </div>
        <div className="relative h-full max-h-[500px] w-full max-w-[350px] border-2 border-[#6750A4] rounded-t-[35px] cursor-pointer">
          <div className="relative rounded-t-[35px] h-[70%]">
            <Image
              src={
                menuItem.name === "Butter Chicken"
                  ? "/butter-chicken.png"
                  : menuItem.name === "Paneer Tikka"
                    ? "/paneer-tikka.png"
                    : menuItem.name === "Cheeseburger"
                      ? "/cheeseburger.png"
                      : "/pepproni-pizza.png"
              }
              alt={menuItem.name}
              fill
              className="rounded-t-[35px] object-cover"
            />
          </div>

          <div className="bg-white rounded-t-[35px] absolute bottom-0 left-0 right-0 h-[50%] -ml-[1.3px] -mb-[1.2px] -mr-[1.2px] shadow-[0px_0px_28px_#6750A440] flex flex-col px-4 pt-6 gap-10 items-center">
            <div className="flex justify-between w-full">
              <div className="text-xl text-[#6750A4]">{menuItem.name}</div>

              <div className="flex gap-1 px-3 py-1 rounded-full bg-[#008D00] items-center">
                <Image src="/star.svg" alt="rating" width={12} height={12} />
                <div className="text-[10px] mt-1 text-white">4.3</div>
              </div>
            </div>

            <div className={"text-[10px] md:text-xs " + numanFont.className}>
              {getDescriptionForMenu(menuItem.name)}
            </div>
            <div className="flex gap-6 w-fit items-center">
              <div
                className="text-lg md:text-2xl text-white px-4 py-2 rounded-full bg-[#6750A4] cursor-pointer"
                onClick={(e) => handleQuantityDecrease(e)}
              >
                -
              </div>
              <div>{quantity}</div>
              <div
                className="text-lg md:text-2xl text-white px-4 py-2 rounded-full bg-[#6750A4] cursor-pointer"
                onClick={(e) => handleQuantityIncrease(e)}
              >
                +
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MenuOpened;
