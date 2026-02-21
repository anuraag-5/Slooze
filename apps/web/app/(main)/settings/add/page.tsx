import { Suspense } from "react";
import PaymentAdd from "@/components/PaymentAdd";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentAdd />
    </Suspense>
  );
}