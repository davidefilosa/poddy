"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";
import { ModeToggle } from "./mode-toggle";

export const Navbar = () => {
  const router = useRouter();
  return (
    <div className="h-16 w-full flex items-center justify-between p-4 border-b border">
      <div
        className="font-bold text-lg"
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      >
        Telly
      </div>
      <div className="flex items-center gap-2">
        <UserButton />
        <ModeToggle />
      </div>
    </div>
  );
};
