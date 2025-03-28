// Este componente renderiza una tarjeta que muestra información sobre un TFG (Trabajo de Fin de Grado).
// Incluye un título, grado, resumen, palabras clave y botones de acción (Verificar y Eliminar).
// Está diseñado para ser reutilizable y recibe un objeto `tfg` como prop con los datos necesarios.

import React, { useState } from 'react';
import Link from 'next/link';

// Componente principal que recibe un objeto `tfg` como prop
export default function TFGcard({ tfg }) {
    // Función auxiliar para truncar texto si excede una longitud máxima
    const truncateText = (text, maxLength) => {
        if (!text) {
            return ''; // Si el texto es nulo o indefinido, retorna una cadena vacía
        }
        if (text.length <= maxLength) {
            return text; // Si el texto es más corto que el límite, retorna el texto completo
        }
        return text.substring(0, maxLength) + '...'; // Si excede el límite, corta el texto y añade "..."
    };

    return (
        <div className="border border-gray-400 rounded-lg overflow-hidden shadow-md mb-4">
            {/* Enlace que lleva a la página de administración del TFG */}
            <Link href={`/dashboard/tfg/admin/${tfg._id}?id=${tfg._id}`}>
                <div className="cursor-pointer bg-gray-100 p-4">
                    {/* Título del TFG, truncado a 80 caracteres */}
                    <h2 className="text-lg font-semibold">{truncateText(tfg.tfgTitle, 80)}</h2>
                    {/* Grado asociado al TFG */}
                    <h3 className="text-sm text-gray-700">{tfg.degree}</h3>
                    {/* Resumen del TFG, truncado a 200 caracteres */}
                    <p className="text-sm text-gray-600">{truncateText(tfg.abstract, 200)}</p>
                </div>
            </Link>

            {/* Sección inferior con palabras clave y botones */}
            <div className="flex flex-wrap justify-between items-center bg-gray-200 p-3">
                {/* Palabras clave del TFG */}
                <div className="flex flex-wrap gap-1">
                    {tfg.keywords.map((element, index) => (
                        <span key={index} className="border border-gray-500 text-xs px-2 py-1 rounded-md">
                            {element} {/* Cada palabra clave se muestra dentro de un span estilizado */}
                        </span>
                    ))}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                    {/* Botón para verificar el TFG */}
                    <button className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-md hover:bg-blue-700 transition">
                        Verificar
                    </button>
                    {/* Botón para eliminar el TFG */}
                    <button className="bg-white border border-red-500 text-red-500 text-sm font-semibold px-4 py-1 rounded-md hover:bg-red-500 hover:text-white transition">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}