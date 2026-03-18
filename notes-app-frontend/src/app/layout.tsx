import type { Metadata } from "next";
import { Inria_Serif, Inter } from "next/font/google";
import AppProviders from "@/components/providers/AppProviders";
import "./globals.css";

const inriaSerif = Inria_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Taking Notes App",
  description: "Taking Notes App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inriaSerif.variable} ${inter.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
