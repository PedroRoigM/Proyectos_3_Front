'use client';

import React from 'react';

export default function LoadingSpinner({ message = 'Cargando...' }) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0065ef] mb-4"></div>
            <p className="text-[#0065ef] font-medium text-lg">{message}</p>
        </div>
    );
}