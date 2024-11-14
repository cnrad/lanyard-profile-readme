import type { Metadata } from "next";
import "./globals.css";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
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
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
