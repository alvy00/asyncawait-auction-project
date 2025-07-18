import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../lib/auth-context";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Analytics } from '@vercel/analytics/next';
import { UserProvider } from "../lib/user-context";
import Chatbot from "./components/Chatbot";

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
  icons: {
    icon: "/logo_favicon.svg",
    apple: "/logo_favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased bg-[#0a0a18]`}
      >
        <AnimatedBackground />
        <UserProvider>
        <AuthProvider>
          <Toaster position='top-center'/>
            {children}
        </AuthProvider>
        </UserProvider>
        <Chatbot />
        <Analytics />
      </body>
    </html>
  );
}
