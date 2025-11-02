"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

export const Navbar = () => {
  const router = useRouter();
  return (
    <div className="h-16 w-full flex items-center justify-between p-4 border-b border-gray-200">
      <div
        className="font-bold text-lg"
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      >
        Telly
      </div>
      <UserButton />
    </div>
  );
};
