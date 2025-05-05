import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../lib/auth-context";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuctaSync - Premium Auction Platform",
  description: "Discover exclusive items and bid with confidence on our secure auction platform. Find art, collectibles, luxury goods and more.",
  keywords: "auction, bidding, collectibles, art auction, luxury auction, online bidding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Toaster position='top-center'/>
          {children}
        </AuthProvider>
        
      </body>
    </html>
  );
}
