import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Travel Planner | Secure GenAI Itineraries",
  description: "Generate hyper-personalized, day-by-day travel itineraries and climate-aware packing lists instantly using Google Gemini AI.",
  icons: {
    // This tells Next.js to look in your public folder for your SVG
    icon: '/travel-svgrepo-com.svg',
    apple: '/travel-svgrepo-com.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-slate-950`}
    >
      <body className="min-h-full flex flex-col text-slate-100 bg-slate-950">
        {children}
      </body>
    </html>
  );
}