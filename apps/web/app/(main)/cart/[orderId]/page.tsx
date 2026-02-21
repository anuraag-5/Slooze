"use client";

import { numanFont } from "@/app/fonts";
import Item from "@/components/Item";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getOrderByOrderId, placeOrder } from "@/lib/app";
import { signOutUser } from "@/lib/auth";
import { ActiveCartType } from "@/lib/types";
import { useUserStore } from "@/lib/userstore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CartPage = () => {
  const router = useRouter();
  const { paymentMethods, user, getActiveCarts, setActiveCarts } =
    useUserStore();
  const [selectedType, setSelectedType] = useState<
    "CARD" | "UPI" | "NETBANKING"
  >("CARD");

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const params = useParams();
  const orderId = params?.orderId as string;
  const [cart, setCart] = useState<ActiveCartType | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCheckout = async () => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token || user?.role === "MEMBER" || !orderId) return;
    await placeOrder({
      access_token,
      restId: cart!.restId,
      orderId,
      paymentMethodId: selectedPaymentId,
    });
    const updatedcart = await getActiveCarts(cart!.restId, access_token);
    setActiveCarts(updatedcart);
    router.replace(`/restaurants/${cart!.restId}`);
  };

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token || !orderId) return;
    const getCartOrder = async () => {
      const cart = await getOrderByOrderId(access_token, orderId);
      return cart;
    };
    getCartOrder()
      .then((c) => setCart(c))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="flex-1 flex flex-col justify-start items-center gap-5">
      <div className="flex w-full justify-between">
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
      <div className="w-full text-center text-xl md:text-2xl lg:text-3xl mb-5">
        Your Cart
      </div>
      {cart &&
        cart.orderItems.map((oi) => (
          <Item
            key={oi.id}
            cartItem={oi}
            restId={cart.restId}
            orderId={orderId}
            isCart={true}
          />
        ))}
      <div
        className="cursor-pointer p-2 rounded-full bg-[#6750A4]"
        onClick={() =>
          router.push(`/restaurants/${cart!.restId}?orderId=${cart?.id}`)
        }
      >
        Add more
      </div>
      {paymentMethods && (
        <div className="flex flex-col gap-4 w-[300px] mt-6">
          <div className="text-lg font-medium">Select Payment</div>

          {/* Payment Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Payment Type</label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(
                  e.target.value as "CARD" | "UPI" | "NETBANKING",
                );
                setSelectedPaymentId(""); // reset selected payment
              }}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-[#6750A4]"
            >
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
              <option value="NETBANKING">Net Banking</option>
            </select>
          </div>

          {/* Payment Methods Based on Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Payment Method</label>

            {paymentMethods[selectedType].length > 0 ? (
              <select
                value={selectedPaymentId}
                onChange={(e) => setSelectedPaymentId(e.target.value)}
                className="border rounded-lg p-2 focus:ring-2 focus:ring-[#6750A4]"
              >
                <option value="">Select</option>
                {paymentMethods[selectedType].map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    **** {pm.last4}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-gray-500">
                No saved {selectedType} methods.
              </div>
            )}
          </div>
        </div>
      )}
      {paymentMethods && (
        <button
          onClick={handleCheckout}
          disabled={!selectedPaymentId && user?.role === "MEMBER"}
          className={`mt-6 px-6 py-2 rounded-full text-white transition ${
            selectedPaymentId
              ? "bg-[#6750A4] hover:bg-[#8b76c2]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {user?.role === "MEMBER" ? "Member can't place order" : "Place order"}
        </button>
      )}
    </section>
  );
};

export default CartPage;
