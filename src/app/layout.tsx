import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

const Switzer = localFont({
  src: [
    { path: "../../public/Switzer-Bold.woff", weight: "bold", style: "normal" },
    {
      path: "../../public/Switzer-Bold.woff2",
      weight: "bold",
      style: "normal",
    },
    {
      path: "../../public/Switzer-Italic.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/Switzer-Italic.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/Switzer-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Switzer-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/Switzer-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AMPV Media",
  description: "AMPV Media - Digital Marketing Agency",
  icons: {
    icon: "/fav-ico-amp.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={Switzer.className}>
        <main className="main_content site_flex flex_column site_gap">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
