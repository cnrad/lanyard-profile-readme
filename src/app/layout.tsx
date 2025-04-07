import type { Metadata } from "next";
import "./globals.css";
import { CSideScript } from "@c-side/next";
import { Open_Sans } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import Head from "next/head";

const openSans = Open_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const robotoMono = Roboto_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Lanyard for GitHub Profile",
  description: "Display your Discord Presence anywhere, using Lanyard",
  openGraph: {
    title: "Lanyard for GitHub Profile",
    description: "Display your Discord Presence anywhere, using Lanyard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <CSideScript />
      <body
        className={`${openSans.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
