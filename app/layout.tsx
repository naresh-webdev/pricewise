import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pricewise",
  description:
    "Track product prices effortlessly and save money on your online shopping",
  icons: {
    other: {
      rel: "script",
      url: "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="max-w-10xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
