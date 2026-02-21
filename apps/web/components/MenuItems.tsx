import Image from "next/image";
import MenuOpened from "./MenuOpened";
import * as motion from "motion/react-client";
import { MenuItem } from "@/lib/types";
import { useState } from "react";
import { numanFont, poppinsFont } from "@/app/fonts";
import { useUserStore } from "@/lib/userstore";
import { getDescriptionForMenu } from "@/lib/utils";
import { useRouter } from "next/navigation";

const MenuItems = ({menuItems, orderId, restId}: {menuItems: MenuItem[] | null, orderId: string | null, restId: string}) => {
  const router = useRouter();
  const { user, activeCarts, setActiveCarts, getActiveCarts } =
    useUserStore();
  const [quantity, setQuantity] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const handleItemClick = (mi: MenuItem) => {
    if(orderId && activeCarts) {
      const ac = activeCarts.find((ac) => ac.id === orderId);
      if(ac) {
        const item = ac.orderItems.find((oi) => oi.menuItemId === mi.id);
        if(!item) {
          setQuantity(0);
          setActiveOrderId(ac.id);
          setSelectedMenu(mi);
          return;
        } else {
          setQuantity(item!.quantity);
          setActiveOrderId(ac.id);
          setSelectedMenu(mi);
          return;
        }
      } else {
        setQuantity(0);
        setActiveOrderId(null);
        setSelectedMenu(mi);
        return;
      }
    } else if(!orderId && activeCarts) {
      const ac = activeCarts.find((ac) => (ac.userId === user?.id && ac.orderItems.find((oi) => oi.menuItemId === mi.id)));
      if(ac){
        const item = ac.orderItems.find((oi) => oi.menuItemId === mi.id);
        setQuantity(item!.quantity);
        setActiveOrderId(ac.id);
        setSelectedMenu(mi);
        return;
      } else {
        setQuantity(0);
        setActiveOrderId(null);
        setSelectedMenu(mi);
        return;
      }
    }
  }
  const handleItemClose = ()=> {
    setQuantity(0);
    setSelectedMenu(null);
    setActiveOrderId(null);
  }
  return (
    <>
      {selectedMenu && (
        <MenuOpened
          restId={restId}
          menuItem={selectedMenu}
          quantity={quantity}
          activeOrderId={activeOrderId}
          onClose={handleItemClose}
          setQuantity={setQuantity}
          getActiveCarts={getActiveCarts}
          setActiveCarts={setActiveCarts}
        />
      )}

      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className={
            "text-lg md:text-xl lg:text-2xl mt-10 flex justify-between " + numanFont.className
          }
        >
          <div>Explore our cuisines :</div>
          <div className={"text-[#6750A4] text-md md:text-xl cursor-pointer " + poppinsFont.className}
          onClick={() => router.push(`/orders/${restId}`)}
          >PLaced Orders</div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-7">
          {menuItems && menuItems.length > 0
            ? menuItems.map((mi) => (
                <div
                  key={mi.id}
                  className="relative h-[418px] max-w-[360px] border-2 border-[#6750A4] rounded-t-[35px] cursor-pointer hover:scale-[1.02] transition"
                  onClick={() => handleItemClick(mi)}
                >
                  <div className="relative rounded-t-[35px] h-[70%]">
                    <Image
                      src={
                        mi.name === "Butter Chicken"
                          ? "/butter-chicken.png"
                          : mi.name === "Paneer Tikka"
                            ? "/paneer-tikka.png"
                            : mi.name === "Cheeseburger"
                              ? "/cheeseburger.png"
                              : "/pepproni-pizza.png"
                      }
                      alt={mi.name}
                      fill
                      className="rounded-t-[35px] object-cover"
                    />
                  </div>

                  <div className="bg-white rounded-t-[35px] absolute bottom-0 left-0 right-0 h-[50%] -ml-[1.3px] -mb-[1.2px] -mr-[1.2px] shadow-[0px_0px_28px_#6750A440] flex flex-col px-4 pt-6 gap-10"
                  >
                    <div className="flex justify-between">
                      <div className="text-xl text-[#6750A4]">{mi.name}</div>

                      <div className="flex gap-1 px-3 py-1 rounded-full bg-[#008D00] items-center">
                        <Image
                          src="/star.svg"
                          alt="rating"
                          width={12}
                          height={12}
                        />
                        <div className="text-[10px] mt-1 text-white">4.3</div>
                      </div>
                    </div>

                    <div
                      className={"text-xs md:text-sm " + numanFont.className}
                    >
                      {getDescriptionForMenu(mi.name)}
                    </div>
                  </div>
                </div>
              ))
            : "No Menu Items"}
        </div>
      </motion.div>
    </>
  );
};

export default MenuItems;
