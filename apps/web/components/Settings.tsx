import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUserStore } from "@/lib/userstore";
import { PaymentMethod } from "@/lib/types";
import toast from "./Toast";

const Settings = ({
}: {
}) => {
  const { user, paymentMethods} = useUserStore();
  const [hovered, setHovered] = useState(false);
  const handleForbiddenClick = () => {
    toast({title: "Only Admins can update"})
  }
  return (
    <div className="flex flex-col mt-10">
      <div className="text-lg md:text-xl lg:text-2xl">Payment Methods</div>
      <div className="flex gap-3 mt-5">
        {paymentMethods || paymentMethods!.length <= 0 ? (
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
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Settings;
