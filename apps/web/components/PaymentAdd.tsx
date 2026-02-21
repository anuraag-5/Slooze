"use client";

import * as motion from "motion/react-client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/userstore";
import Image from "next/image";
import { numanFont } from "@/app/fonts";
import { signOutUser } from "@/lib/auth";
import { updatePaymentMethod } from "@/lib/app";
import { PaymentMethod } from "@/lib/types";

type PaymentType = "CARD" | "UPI" | "NETBANKING";

const PaymentAdd = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeFromQuery = searchParams.get("type") as PaymentType | null;

  const { user, paymentMethods, setPaymentMethods } = useUserStore();

  const [selectedType, setSelectedType] = useState<PaymentType>("CARD");
  const [last4, setLast4] = useState("");
  const [hovered, setHovered] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (
      typeFromQuery &&
      ["CARD", "UPI", "NETBANKING"].includes(typeFromQuery)
    ) {
      setSelectedType(typeFromQuery);
    }
  }, [typeFromQuery]);

  const handleSubmit = async () => {
    if (!isAdmin) return;
    if (!last4.trim()) return;

    const access_token = localStorage.getItem("access_token");
    if (!access_token) return;

    const resp: PaymentMethod | null = await updatePaymentMethod({
      access_token,
      last4,
      type: selectedType,
    });

    if (!resp) return;

    setPaymentMethods({
      ...paymentMethods!,
      [resp.type]: [...paymentMethods![resp.type], resp],
    });

    router.push("/restaurants");
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center rounded-3xl relative">
      <div className="flex w-full justify-between absolute top-2">
        <div
          className={
            "text-lg md:text-2xl lg:text-4xl text-[#6750A4] cursor-pointer " +
            numanFont.className
          }
          onClick={() => router.push("/restaurants")}
        >
          Slooze
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
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-xl w-[300px] md:w-[400px]">
        <h2 className="text-xl font-semibold mb-6">Add Payment Method</h2>

        {/* Dropdown */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm text-gray-600">Select Payment Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as PaymentType)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6750A4] max-w-fit"
          >
            <option value="CARD">Card</option>
            <option value="UPI">UPI</option>
            <option value="NETBANKING">Net Banking</option>
          </select>
        </div>

        {/* Last 4 Input */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm text-gray-600">
            {selectedType === "CARD"
              ? "Last 4 Digits of Card"
              : selectedType === "UPI"
                ? "Last 4 Characters of UPI"
                : "Last 4 Characters of Account"}
          </label>
          <input
            type="text"
            maxLength={4}
            value={last4}
            onChange={(e) => setLast4(e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
            placeholder="Enter last 4"
          />
        </div>

        {/* Submit Section */}
        <div
          className="relative"
          onMouseEnter={() => !isAdmin && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Button
            disabled={!isAdmin}
            onClick={handleSubmit}
            className={`w-full rounded-full ${
              isAdmin
                ? "bg-[#6750A4] hover:bg-[#8b76c2]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </Button>
          {!isAdmin && hovered && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-[110%] left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-white text-sm text-gray-700 p-3 rounded-lg shadow-lg border"
            >
              Only admins can update or add payment methods.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentAdd;
export const dynamic = "force-dynamic";