'use client';
import React, { useState } from 'react';

export default function CategoryCard({
    id,
    title,
    type,
    onDelete,
    onToggleStatus,
    isActive = true
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition 
                ${isActive ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    {!isActive && (
                        <span className="mr-2 flex h-3 w-3">
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400"></span>
                        </span>
                    )}
                    {isActive && (
                        <span className="mr-2 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    )}
                    <span className={`font-medium ${!isActive ? 'text-gray-500' : ''}`}>{title}</span>
                </div>

                <div className={`flex space-x-2 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    <button
                        className={`text-sm px-2 py-1 rounded ${isActive
                            ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                            : 'text-green-600 hover:text-green-800 hover:bg-green-50'}`}
                        onClick={() => onToggleStatus(id, type)}
                    >
                        {isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                        className="text-sm text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                        onClick={() => onDelete(id, type)}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}