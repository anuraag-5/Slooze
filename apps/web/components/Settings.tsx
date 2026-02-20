import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUserStore } from "@/lib/userstore";
import { PaymentMethod } from "@/lib/types";
import { numanFont } from "@/app/fonts";
import { useRouter } from "next/navigation";

const Settings = ({
}: {
}) => {
  const { user, paymentMethods} = useUserStore();
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  return (
    <div className="flex flex-col mt-10">
      <div className="text-lg md:text-xl lg:text-2xl">Payment Methods</div>
      <div className="flex gap-3 mt-5">
        {!paymentMethods ? (
          <div>
            <div className="mb-3">You have no Payment Methods saved.</div>
            {user?.role === "ADMIN" ? (
              <div>
                <Button className="bg-[#6750A4] rounded-full px-5 hover:bg-[#8b76c2]">
                  Add
                </Button>
              </div>
            ) : (
              <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="relative w-fit"
              >
                <Button
                  className="bg-[#6750A4] rounded-full px-5 hover:bg-[#8b76c2]"
                  onClick={() => setHovered((v) => !v)}
                >
                  Add
                </Button>
                {hovered ? (
                  <motion.div
                    className="absolute h-100px w-[300px] md:w-[400px] bg-white rounded-lg p-3 top-10 text-sm"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.9,
                    }}
                    onClick={() =>  setHovered(false)}
                  >
                    Only Admins can update or add Payment methods.
                  </motion.div>
                ) : null}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 md:gap-0 my-5 w-full place-items-center md:place-items-start">
            <div className="h-[300px] w-[250px] bg-white rounded-4xl shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-between px-3 py-4">
              <div className="w-full flex justify-between items-center">
                <div className={numanFont.className}>{paymentMethods.CARD[0]?.type}</div>
                <div className="py-1 px-4 rounded-full bg-[#6750A4] text-white cursor-pointer"
                onClick={() => router.push("/settings/add?type=CARD")}
                >
                  Add
                </div>
              </div>
              <div className="flex flex-col gap-2 max-h-[60px] overflow-y-scroll">
                {
                  paymentMethods.CARD.map((pm) => (
                    <div key={pm.id}>{pm.last4}</div>
                  ))
                }
              </div>
            </div>
            <div className="h-[300px] w-[250px] bg-white rounded-4xl shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-between px-3 py-4">
              <div className="w-full flex justify-between items-center">
                <div className={numanFont.className}>{paymentMethods.UPI[0]?.type}</div>
                <div className="py-1 px-4 rounded-full bg-[#6750A4] text-white cursor-pointer"
                onClick={() => router.push("/settings/add?type=UPI")}
                >Add
                </div>
              </div>
              <div className="flex flex-col gap-2 max-h-[60px] overflow-y-scroll">
                {
                  paymentMethods.UPI.map((pm) => (
                    <div key={pm.id}>{pm.last4}</div>
                  ))
                }
              </div>
            </div>
            <div className="h-[300px] w-[250px] bg-white rounded-4xl shadow-[0_0_20px_rgba(0,0,0,0.25)] flex flex-col justify-between px-3 py-4">
              <div className="w-full flex justify-between items-center">
                <div className={numanFont.className}>{paymentMethods.NETBANKING[0]?.type}</div>
                <div className="py-1 px-4 rounded-full bg-[#6750A4] text-white cursor-pointer"
                onClick={() => router.push("/settings/add?type=NETBANKING")}
                >
                  Add
                </div>
              </div>
              <div className="flex flex-col gap-2 max-h-[60px] overflow-y-scroll">
                {
                  paymentMethods.NETBANKING.map((pm) => (
                    <div key={pm.id}>{pm.last4}</div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
