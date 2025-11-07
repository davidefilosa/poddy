"use client";

import { useLayoutStore } from "@/stores/use-layout-store";
import React from "react";
import { StoriesGrid } from "./stories-grid";
import { StoriesList } from "./stories-list";

export const Stories = () => {
  const { layout } = useLayoutStore();
  return <>{layout === "grid" ? <StoriesGrid /> : <StoriesList />}</>;
};
