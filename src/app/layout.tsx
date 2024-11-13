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
  description: "Utilize Lanyard to display your Discord Presence in your GitHub Profile",
  openGraph: {
    title: "Lanyard for GitHub Profile",
    description: "Utilize Lanyard to display your Discord Presence in your GitHub Profile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Supress Hydration Warning that caused by some extensions such as Colorzilla, do not remove this. */}
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
