import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';
import { LanguageProvider } from "./context/LanguageContext"; 
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// PROFI METAADATOK A JOBB KERESÉSI TALÁLATOKÉRT
export const metadata: Metadata = {
  title: "Balatonhegyvidéki Apartman | Panorámás Szállás a Balatonnál",
  description: "Élvezze a nyugalmat és a csodálatos panorámát modern apartmanunkban. Tökéletes kikapcsolódás a Balaton-felvidéken. Foglaljon most!",
  keywords: ["apartman", "Balaton", "szállás", "kiadó apartman", "Balaton-felvidék", "panoráma"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu"> {/* ÁTÍRVA MAGYARRA, hogy a böngésző ne akarja lefordítani */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}