import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GalleryFooter } from "@/components/GalleryFooter";
import { Header } from "@/components/Header";
import { MatureContentProvider } from "@/components/MatureContentProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PlushBroker — A Collection of Plushies",
  description: "A cozy collection of plushie friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} flex min-h-screen flex-col font-sans`}>
        <MatureContentProvider>
          <Header />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6">
            <div className="flex flex-1 flex-col">{children}</div>
            <GalleryFooter />
          </main>
        </MatureContentProvider>
      </body>
    </html>
  );
}
