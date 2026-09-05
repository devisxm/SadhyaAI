import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moru Engine Pro",
  description: "Advanced fluid dynamics modeling for your Sadya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} font-sans dark antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        {children}
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
