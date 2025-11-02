import { UserButton } from "@clerk/nextjs";
import React from "react";

export const Navbar = () => {
  return (
    <div className="h-16 w-full flex items-center justify-between p-4 border-b border-gray-200">
      <div className="ml-4 font-bold text-lg">Telly</div>
      <UserButton />
    </div>
  );
};
