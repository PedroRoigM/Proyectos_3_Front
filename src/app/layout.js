'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "./components/TopBar";
import { usePathname } from "next/navigation";
import { ErrorBoundary } from "./components/errors/error-boundary";
import { NotificationProvider } from "./components/errors/notification-context";
import { useGlobalErrorHandler } from "./components/errors/global-error-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Componente para configurar el manejador global de errores
function GlobalErrorHandler() {
  useGlobalErrorHandler((errorInfo) => {
    console.error("Error global capturado:", errorInfo);
    // Las notificaciones se manejan automáticamente en el componente NotificationProvider
  });
  return null;
}

export default function RootLayout({ children }) {
  // Obtener la ruta actual
  const pathname = usePathname();

  // Ocultar TopBar si estamos en /dashboard o en sus subrutas
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <NotificationProvider>
            <GlobalErrorHandler />
            {!isDashboard && <TopBar />} {/* Solo se muestra si NO es dashboard */}
            {children}
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}