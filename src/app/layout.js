'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "./components/TopBar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  // Obtener la ruta actual
  const pathname = usePathname();

  // Ocultar TopBar si estamos en /dashboard o en sus subrutas
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!isDashboard && <TopBar />} {/* Solo se muestra si NO es dashboard */}
        {children}
      </body>
    </html>
  );
}
