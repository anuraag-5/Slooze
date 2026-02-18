import React from "react";

export default function LoadingSpinner({ classname }: { classname?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5DBFF]">
      <div className="animate-spin rounded-full border-b-4 border-[#6750A4] h-16 w-16"></div>
    </div>
  );
}
