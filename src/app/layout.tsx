import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-terminal",
});

export const metadata: Metadata = {
  title: "Shivang Gupta | Backend & DevOps Engineer",
  description:
    "Terminal-style portfolio of Shivang Gupta, Backend & DevOps Engineer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} font-terminal`}>{children}</body>
    </html>
  );
}
