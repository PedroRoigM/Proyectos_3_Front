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
        <div className="pb-3 rounded-md w-full overflow-hidden border border-[#000000] mb-4">
            <Link href={`/dashboard/tfg/admin/${tfg._id}?id=${tfg._id}`}>
                <div className="cursor-pointer">
                    <div className="bg-[#e5e9ec] p-5">
                        <h2>{truncateText(tfg.tfgTitle, 100)}</h2>
                        <h3>{tfg.degree}</h3>
                        <p>{truncateText(tfg.abstract, 300)}</p>
                    </div>
                </div>
            </Link>

            <div className="flex gap-2 flex-wrap justify-between bg-[#F2F2F2] pt-2 pl-3">
                <div className='flex gap-2'>
                    {tfg.keywords.map((element, index) => (
                        <p key={index} className="border border-gray-500 rounded-md px-2 py-1">
                            {element}
                        </p>
                    ))}
                </div>
                <div className='flex gap-2 mr-2'>
                    <button className='bg-[#14192c] text-white border-2 border-[#14192c] font-bold px-4 py-2 rounded-md hover:text-green-400 transition'>
                        Verificar
                    </button>
                    <button className='bg-[#ffffff] text-black border-2 border-[#14192c] font-bold px-4 py-2 rounded-md hover:text-red-600 transition'>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}