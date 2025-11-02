import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/customs/navbar";
import QueryProvider from "@/components/providers/query-provider";
import { CreateModal } from "@/components/customs/create-modal";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Telly",
  description: "Your AI-powered podcast creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          <Navbar />
          <main>
            <QueryProvider>
              {children}
              <Toaster />
              <CreateModal />
            </QueryProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
