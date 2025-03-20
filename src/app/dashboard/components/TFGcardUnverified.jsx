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
        <div className="border border-gray-400 rounded-lg overflow-hidden shadow-md mb-4">
            <Link href={`/dashboard/tfg/admin/${tfg._id}?id=${tfg._id}`}>
                <div className="cursor-pointer bg-gray-100 p-4">
                    <h2 className="text-lg font-semibold">{truncateText(tfg.tfgTitle, 80)}</h2>
                    <h3 className="text-sm text-gray-700">{tfg.degree}</h3>
                    <p className="text-sm text-gray-600">{truncateText(tfg.abstract, 200)}</p>
                </div>
            </Link>

            <div className="flex flex-wrap justify-between items-center bg-gray-200 p-3">
                {/* Palabras clave */}
                <div className="flex flex-wrap gap-1">
                    {tfg.keywords.map((element, index) => (
                        <span key={index} className="border border-gray-500 text-xs px-2 py-1 rounded-md">
                            {element}
                        </span>
                    ))}
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                    <button className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-md hover:bg-blue-700 transition">
                        Verificar
                    </button>
                    <button className="bg-white border border-red-500 text-red-500 text-sm font-semibold px-4 py-1 rounded-md hover:bg-red-500 hover:text-white transition">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>

    );
}