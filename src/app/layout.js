// Este archivo define el layout principal de la aplicación.
// Se encarga de configurar las fuentes globales, importar estilos y componentes,
// y renderizar el contenido principal de la aplicación. Además, incluye lógica
// para mostrar u ocultar el componente TopBar dependiendo de la ruta actual.

'use client'; // Indica que este archivo se ejecuta en el cliente.
import { Geist, Geist_Mono } from "next/font/google"; // Importación de fuentes personalizadas de Google.
import "./globals.css"; // Importación de estilos globales.
import TopBar from "./components/TopBar"; // Componente de barra superior.
import { usePathname } from "next/navigation"; // Hook para obtener la ruta actual.

// Configuración de la fuente Geist Sans
const geistSans = Geist({
  variable: "--font-geist-sans", // Variable CSS para la fuente Geist Sans.
  subsets: ["latin"], // Subconjunto de caracteres soportados.
});

// Configuración de la fuente Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono", // Variable CSS para la fuente Geist Mono.
  subsets: ["latin"], // Subconjunto de caracteres soportados.
});

// Componente principal de layout
/**
 * RootLayout es el componente principal que envuelve toda la aplicación.
 * 
 * @param {Object} props - Las propiedades que recibe el componente.
 * @param {React.ReactNode} props.children - Los elementos hijos que se renderizan dentro del layout.
 * 
 * @returns {JSX.Element} - Devuelve el layout principal de la aplicación.
 */
export default function RootLayout({ children }) {
  // Obtener la ruta actual
  const pathname = usePathname();

  // Determinar si la ruta actual pertenece a /dashboard o sus subrutas
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Mostrar TopBar solo si no estamos en /dashboard */}
        {!isDashboard && <TopBar />}
        {children}
      </body>
    </html>
  );
}