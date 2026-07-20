import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast"; 
import { Analytics } from "@vercel/analytics/next"
import NextTopLoader from 'nextjs-toploader'; // 🛑 NAYA: Progress bar import kiya
import NotificationListener from "./components/NotificationListener";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bharosa Lab Partner",
  description: "Pathology Lab Management Portal",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bharosa Lab",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        
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
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}