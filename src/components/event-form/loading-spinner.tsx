import React from "react";

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-primary border-solid rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
}