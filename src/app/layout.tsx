import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-terminal",
});

export const metadata: Metadata = {
  title: "Shivang Gupta | DevOps & Site Reliability Engineer",
  description:
    "Terminal-style portfolio of Shivang Gupta — DevOps & SRE engineer specializing in Kubernetes, Terraform, CI/CD, and AWS.",
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
