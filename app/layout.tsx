import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast"; 
import NextTopLoader from 'nextjs-toploader'; // 🛑 NAYA: Progress bar import kiya
import NotificationListener from "./components/NotificationListener";
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
  title: "Bharosa Lab Partner",
  description: "Pathology Lab Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* 🛑 NAYA: Top Progress Bar */}
        <NextTopLoader 
          color="#2563EB" /* Bharosa Lab ka Blue Color */
          initialPosition={0.08} 
          crawlSpeed={200} 
          height={3} /* Line ki motai */
          crawl={true} 
          showSpinner={false} /* Right side wala gol spinner band kar diya taake clean lagay */
          easing="ease" 
          speed={200} 
          shadow="0 0 10px #2563EB,0 0 5px #2563EB" /* Glowing effect */
        />

        {/* Toaster lagaya taake notification screen par pop ho */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontWeight: 'bold', borderRadius: '12px' },
          }} 
        />

        {/* Background Notification Engine */}
        <NotificationListener />
        
        {children}
      </body>
    </html>
  );
}