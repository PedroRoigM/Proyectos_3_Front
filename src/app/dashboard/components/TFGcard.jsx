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
            <Link href={`/dashboard/tfg/${tfg._id}?id=${tfg._id}`}>
                <div className="cursor-pointer">
                    <div className="bg-[#e5e9ec] p-5">
                        <h2 className="text-lg md:text-xl lg:text-2xl">{truncateText(tfg.tfgTitle, 100)}</h2>
                        <h3 className="text-md md:text-lg lg:text-xl">{tfg.degree}</h3>
                        <p className="text-sm md:text-md lg:text-lg">{truncateText(tfg.abstract, 300)}</p>
                    </div>
                </div>
            </Link>
            <div className="flex gap-2 flex-wrap bg-[#F2F2F2] pt-2 pl-3">
                {tfg.keywords.map((element, index) => (
                    <p key={index} className="border border-gray-500 rounded-md px-2 py-1 text-xs md:text-sm lg:text-md">
                        {element}
                    </p>
                ))}
            </div>
        </div>
    );
}