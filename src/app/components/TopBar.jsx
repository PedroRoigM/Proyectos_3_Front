// Componente que renderiza a barra superior da dashboard
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
export default function TopBar() {
    return (
        <div className="flex justify-between items-center border-b-[2px] border-black shadow-md p-[2%]">
            {/* Logo */}
            <Image src="/logo.jpg" alt="Logo" width="150" height="150" />
        </div>
    );
}