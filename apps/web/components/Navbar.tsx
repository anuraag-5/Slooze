import { signOutUser } from "@/lib/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import { Dispatch, SetStateAction, useState } from "react";
import { numanFont } from "@/app/fonts";

const Navbar = ({
  path,
  currentTab,
  setCurrentTab
}: {
  path: string;
  currentTab: string;
  setCurrentTab: Dispatch<SetStateAction<string>>;
}) => {
  const router = useRouter();

  return (
    <motion.div 
    className="flex justify-between items-center"
    initial={{
      y: -5
    }}
    animate={{
      y: 0
    }}
    transition={{
      duration: 0.6
    }}
    >
      <div className={"text-lg md:text-2xl lg:text-4xl text-[#6750A4] " + numanFont.className}>
        Slooze
      </div>
      <div className="flex gap-2">
        <div
          className="p-1 md:p-3 min-w-[90px] md:min-w-[150px] text-center relative cursor-pointer"
          onClick={() => setCurrentTab(path)}
        >
          <span className="relative z-20 text-[12px] md:text-[16px]">
            {path === "restaurants" ? "Restaurants" : "Menu"}
          </span>
          {currentTab === "restaurants" || currentTab === "menu" ? (
            <motion.div
              className="absolute inset-0 bg-[#6750A4] z-10 rounded-full"
              layoutId="tab"
              transition={{
                duration: 0.6,
              }}
            ></motion.div>
          ) : null}
        </div>
        <div
          className="p-1 md:p-3 min-w-[90px] md:min-w-[150px] text-center relative cursor-pointer"
          onClick={() => setCurrentTab("settings")}
        >
          <span className="relative z-20 text-[12px] md:text-[16px]">Settings</span>
          {currentTab === "settings" ? (
            <motion.div
              className="absolute inset-0 bg-[#6750A4] z-10 rounded-full"
              layoutId="tab"
              transition={{
                duration: 0.6,
              }}
            ></motion.div>
          ) : null}
        </div>
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
    </motion.div>
  );
};

export default Navbar;
