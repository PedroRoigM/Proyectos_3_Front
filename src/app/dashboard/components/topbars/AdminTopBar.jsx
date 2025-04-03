"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogOut, FileCheck, Search, Settings, Users } from "lucide-react";

export default function AdminTopBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    const handleLogout = () => {
        // Eliminar la cookie de token
        document.cookie = "bytoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        // Redirigir a la página de inicio
        window.location.href = "/";
    };

    return (
        <header className="w-full bg-white border-b-[2px] border-[#14192c] shadow-md p-1 md:p-1">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/dashboard">
                    <Image src="/logo.jpg" alt="Logo" width={120} height={120} className="cursor-pointer" />
                </Link>

                {/* Menú en escritorio */}
                <nav className="hidden md:flex items-center gap-6 relative">
                    <Link href="/dashboard" className="hover:text-[#14192c] transition duration-300 font-medium">
                        Destacados
                    </Link>
                    <Link href="/dashboard/upload-tfg" className="hover:text-[#14192c] transition duration-300 font-medium">
                        Subir TFG
                    </Link>
                    <Link
                        href="/dashboard/admin/search"
                        className="flex items-center gap-1 text-[#0065ef] hover:text-[#14192c] transition duration-300 font-medium"
                    >
                        <Search size={18} />
                        <span>Revisión</span>
                    </Link>

                    {/* Menú de administrador */}
                    <div className="relative">
                        <button
                            onClick={() => setShowAdminMenu(!showAdminMenu)}
                            className="flex items-center gap-1 text-[#14192c] font-semibold hover:text-[#0065ef] transition-colors p-2 rounded-md"
                        >
                            <Settings size={18} />
                            <span>Admin</span>
                        </button>

                        {showAdminMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-200">
                                <Link
                                    href="/dashboard/admin/roles"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Users size={16} />
                                    <span>Gestionar Usuarios</span>
                                </Link>
                                <Link
                                    href="/dashboard/admin/control-panel"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <span>Gestionar Grados</span>
                                </Link>
                            </div>
                        )}
                    </div>

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

                    <div className="w-full border-t border-gray-200 pt-2">
                        <p className="text-center font-bold text-sm text-gray-600 mb-2">Panel de Administración</p>
                        <Link
                            href="/dashboard/admin/users"
                            className="flex items-center gap-2 py-2 justify-center text-[#14192c] hover:text-[#0065ef]"
                            onClick={() => setIsOpen(false)}
                        >
                            <Users size={16} />
                            <span>Gestionar Usuarios</span>
                        </Link>
                        <Link
                            href="/dashboard/admin/degrees"
                            className="flex items-center gap-2 py-2 justify-center text-[#14192c] hover:text-[#0065ef]"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>Gestionar Grados</span>
                        </Link>
                        <Link
                            href="/dashboard/admin/years"
                            className="flex items-center gap-2 py-2 justify-center text-[#14192c] hover:text-[#0065ef]"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>Gestionar Años</span>
                        </Link>
                        <Link
                            href="/dashboard/admin/advisors"
                            className="flex items-center gap-2 py-2 justify-center text-[#14192c] hover:text-[#0065ef]"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>Gestionar Tutores</span>
                        </Link>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors mt-2"
                    >
                        <LogOut size={18} />
                        <span>Cerrar sesión</span>
                    </button>
                </nav>
            )}
        </header>
    );
}