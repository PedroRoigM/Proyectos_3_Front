// Componente que renderiza una tarjeta con la información de un TFG
import React, { useState } from 'react';
import Link from 'next/link';

export default function TFGcard({ tfg }) {
    const truncateText = (text, maxLength) => {
        if (!text) {
            return '';
        }
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="border w-full border-black rounded-md overflow-hidden shadow-md">
            <Link href={`/dashboard/tfg/${tfg._id}?id=${tfg._id}`} className="block">
                <div className="bg-gray-200 p-4 hover:bg-gray-300 transition">
                    <h2 className="text-lg md:text-xl font-semibold">{truncateText(tfg.tfgTitle, 80)}</h2>
                    <h3 className="text-sm md:text-md text-gray-700">{tfg.degree}</h3>
                    <p className="text-xs md:text-sm text-gray-600">{truncateText(tfg.abstract, 180)}</p>
                </div>
            </Link>

            <div className="flex flex-wrap gap-2 bg-gray-100 p-2">
                {tfg.keywords.map((keyword, index) => (
                    <span key={index} className="border border-gray-500 rounded-md px-2 py-1 text-xs md:text-sm">
                        {keyword}
                    </span>
                ))}
            </div>
        </div>
    );
}