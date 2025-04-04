"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogOut, FileCheck, Search } from "lucide-react";

export default function CoordinatorTopBar() {
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        // Eliminar la cookie de token
        document.cookie = "bytoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        // Redirigir a la página de inicio
        window.location.href = "/";
    };

    return (
        <header className="w-full bg-white border-b-[2px] border-[#0065ef] shadow-md p-1 md:p-1">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/dashboard">
                    <Image src="/logo.jpg" alt="Logo" width={120} height={120} className="cursor-pointer" />
                </Link>

                {/* Menú en escritorio */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/dashboard" className="hover:text-[#14192c] transition duration-300 font-medium">
                        Destacados
                    </Link>
                    <Link href="/dashboard/upload-tfg" className="hover:text-[#14192c] transition duration-300 font-medium">
                        Subir TFG
                    </Link>
                    <Link
                        href="/dashboard/search/admin"
                        className="flex items-center gap-1 text-[#0065ef] hover:text-[#14192c] transition duration-300 font-medium"
                    >
                        <Search size={18} />
                        <span>Revisión</span>
                    </Link>
                    <Link
                        href="/dashboard/admin/verify"
                        className="flex items-center gap-1 text-[#0065ef] hover:text-[#14192c] transition duration-300 font-medium"
                    >
                        <FileCheck size={18} />
                        <span>Pendientes</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Cerrar sesión</span>
                    </button>
                </nav>

                {/* Menú hamburguesa en móvil */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Menú desplegable en móvil */}
            {isOpen && (
                <nav className="md:hidden flex flex-col items-center gap-4 py-4 text-lg border-t border-gray-300">
                    <Link
                        href="/dashboard"
                        className="hover:text-[#14192c] transition duration-300 font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Destacados
                    </Link>
                    <Link
                        href="/dashboard/upload-tfg"
                        className="hover:text-[#14192c] transition duration-300 font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Subir TFG
                    </Link>
                    <Link
                        href="/dashboard/search/admin"
                        className="flex items-center gap-1 text-[#0065ef] hover:text-[#14192c] transition duration-300 font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        <Search size={18} />
                        <span>Revisión</span>
                    </Link>
                    <Link
                        href="/dashboard/admin/verify"
                        className="flex items-center gap-1 text-[#0065ef] hover:text-[#14192c] transition duration-300 font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        <FileCheck size={18} />
                        <span>Pendientes</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Cerrar sesión</span>
                    </button>
                </nav>
            )}
        </header>
    );
}