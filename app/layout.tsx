import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast"; 
import NotificationListener from "./components/NotificationListener"; // 🛑 NAYA: Listener import kiya
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
        
        {/* 🛑 NAYA: Toaster lagaya taake notification screen par pop ho */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontWeight: 'bold', borderRadius: '12px' },
          }} 
        />

        {/* 🛑 NAYA: Background Notification Engine yahan laga diya */}
        <NotificationListener />
        
        {children}
      </body>
    </html>
  );
}