"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Iconos para el menú hamburguesa

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full bg-white border-b-[2px] border-black shadow-md p-4 md:p-6">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/dashboard">
                    <Image src="/logo.jpg" alt="Logo" width={120} height={120} className="cursor-pointer" />
                </Link>

                {/* Menú en escritorio */}
                <nav className="hidden md:flex gap-10 text-lg">
                    <Link href="/dashboard" className="hover:text-[#14192c] transition duration-300 font-medium">
                        Destacados
                    </Link>
                    <Link href="/dashboard/upload-tfg" className="hover:text-[#14192c] transition duration-300 font-medium">
                        Subir TFG
                    </Link>
                </nav>

                {/* Menú hamburguesa en móvil */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Menú desplegable en móvil */}
            {isOpen && (
                <nav className="md:hidden flex flex-col items-center gap-4 py-4 text-lg border-t border-gray-300">
                    <Link href="/dashboard" className="hover:text-[#14192c] transition duration-300 font-medium" onClick={() => setIsOpen(false)}>
                        Destacados
                    </Link>
                    <Link href="/dashboard/upload-tfg" className="hover:text-[#14192c] transition duration-300 font-medium" onClick={() => setIsOpen(false)}>
                        Subir TFG
                    </Link>
                </nav>
            )}
        </header>
    );
}
