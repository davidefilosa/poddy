import { PrismaClient } from "./generated/prisma/client";

declare global {
  // allow global `var` declarations
  var prisma: PrismaClient | undefined;
}

export const prismadb = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;
