'use client';
import { useState, useCallback } from 'react';
import { ErrorTypes } from './enhanced-error-handler';

/**
 * Hook para manejar operaciones asíncronas y errores de API
 * @returns {Object} - Objeto con estado de carga, error y funciones auxiliares
 */
export const useApiError = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Ejecuta una función asíncrona y maneja los errores
     * @param {Function} asyncFn - Función asíncrona a ejecutar
     * @param {Object} options - Opciones de configuración
     * @returns {Promise} - Resultado de la operación
     */
    const executeRequest = useCallback(async (asyncFn, options = {}) => {
        const {
            loadingMessage = 'Cargando...',
            errorMessage = 'Ha ocurrido un error. Inténtalo de nuevo.',
            resetErrorOnStart = true,
            showLoadingState = true
        } = options;

        try {
            if (resetErrorOnStart) {
                setError(null);
            }

            if (showLoadingState) {
                setLoading(true);
            }

            const result = await asyncFn();
            return result;
        } catch (err) {
            console.error('API Error:', err);

            setError({
                message: err.message || errorMessage,
                type: ErrorTypes.ERROR
            });

            return null;
        } finally {
            if (showLoadingState) {
                setLoading(false);
            }
        }
    }, []);

    /**
     * Limpia el estado de error
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Establece un error manualmente
     * @param {string} message - Mensaje de error
     * @param {string} type - Tipo de error
     */
    const setErrorMessage = useCallback((message, type = ErrorTypes.ERROR) => {
        setError({ message, type });
    }, []);

    /**
     * Establece un mensaje de éxito
     * @param {string} message - Mensaje de éxito
     */
    const setSuccessMessage = useCallback((message) => {
        setError({ message, type: ErrorTypes.SUCCESS });
    }, []);

    return {
        loading,
        error,
        executeRequest,
        clearError,
        setErrorMessage,
        setSuccessMessage
    };
};