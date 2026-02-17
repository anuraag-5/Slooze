import React from "react";

export default function LoadingSpinner({ classname }: { classname?: string }) {
  return (
    <div className={"min-h-screen flex items-center justify-center " + classname}>
      <div className="animate-spin rounded-full border-b-2 border-black"></div>
    </div>
  );
}