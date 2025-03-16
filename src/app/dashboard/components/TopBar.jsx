// Componente que renderiza a barra superior da dashboard

import React from 'react';
import Link from 'next/link';
import GetDegrees from './lib/GetDegrees';
import SearchBar from './SearchBar';
export default function TopBar() {
    const degrees = GetDegrees();
    return (
        <div className="flex justify-between items-center border-b-4 border-black p-5 bg-[#0065ef] shadow-md">
            {/* Logo */}
            <h1 className="bg-black text-white px-4 py-2 rounded-lg text-lg font-semibold tracking-wide">
                LOGO
            </h1>

            {/* Navegación */}
            <nav className="flex gap-[20px]">
                <Link href="/dashboard">
                    <p className="text-white hover:text-[#14192c] transition duration-300 cursor-pointer font-medium">
                        Destacados
                    </p>
                </Link>
            </nav>


        </div>
    );
}