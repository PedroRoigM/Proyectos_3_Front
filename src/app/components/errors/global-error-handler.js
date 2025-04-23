'use client';
import { useEffect } from 'react';

/**
 * Configura interceptores globales para capturar errores no manejados
 * @param {Function} errorCallback - Función a llamar cuando se capture un error
 */
export function setupGlobalErrorHandlers(errorCallback) {
    // Solo ejecutar en el navegador, no durante SSR
    if (typeof window === 'undefined') {
        return;
    }

    // Capturar errores no manejados en promesas
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promesa no manejada:', event.reason);

        // Llamar al callback con información del error
        if (errorCallback && typeof errorCallback === 'function') {
            errorCallback({
                type: 'unhandledRejection',
                message: event.reason?.message || 'Error en promesa no manejada',
                error: event.reason,
                source: 'promise'
            });
        }

        // Opcionalmente, prevenir el comportamiento por defecto
        // event.preventDefault();
    });

    // Capturar errores JavaScript no manejados
    window.addEventListener('error', (event) => {
        console.error('Error global:', event.error);

        // Ignorar errores de recursos (imágenes, scripts, etc.)
        if (event.filename) {
            // Llamar al callback con información del error
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback({
                    type: 'uncaughtError',
                    message: event.message || 'Error JavaScript no manejado',
                    error: event.error,
                    source: 'window',
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                });
            }
        }

        // Opcionalmente, prevenir el comportamiento por defecto
        // event.preventDefault();
    });
}

/**
 * Hook para usar en el componente raíz que configura los interceptores de errores
 * @param {Function} errorCallback - Función para manejar errores capturados
 */
export function useGlobalErrorHandler(errorCallback) {
    useEffect(() => {
        setupGlobalErrorHandlers(errorCallback);
    }, [errorCallback]);
}