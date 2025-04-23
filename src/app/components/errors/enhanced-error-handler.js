'use client';
import React, { useState, useEffect } from 'react';

// Mantener los tipos de errores existentes
export const ErrorTypes = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

/**
 * ErrorHandler componente mejorado para mostrar mensajes de error en toda la aplicación
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.type - Tipo de mensaje: 'success', 'error', 'warning', 'info'
 * @param {boolean} props.dismissible - Si el error puede ser descartado
 * @param {function} props.onDismiss - Función a llamar cuando se descarta el error
 * @param {number} props.autoHideTime - Tiempo en ms para ocultar automáticamente (0 para no ocultar)
 */
export const ErrorHandler = ({
    message,
    type = ErrorTypes.ERROR,
    dismissible = true,
    onDismiss,
    autoHideTime = 0
}) => {
    const [isVisible, setIsVisible] = useState(!!message);

    useEffect(() => {
        setIsVisible(!!message);

        // Si se especifica un tiempo de autocierre, configurar un temporizador
        if (autoHideTime > 0 && message) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, autoHideTime);

            return () => clearTimeout(timer);
        }
    }, [message, autoHideTime]);

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) {
            onDismiss();
        }
    };

    if (!message || !isVisible) return null;

    const getClassName = () => {
        switch (type) {
            case ErrorTypes.SUCCESS:
                return "bg-green-100 text-green-700 border-green-300";
            case ErrorTypes.WARNING:
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case ErrorTypes.INFO:
                return "bg-blue-100 text-blue-700 border-blue-300";
            case ErrorTypes.ERROR:
            default:
                return "bg-red-100 text-red-700 border-red-300";
        }
    };

    const getIcon = () => {
        switch (type) {
            case ErrorTypes.SUCCESS:
                return "✅";
            case ErrorTypes.WARNING:
                return "⚠️";
            case ErrorTypes.INFO:
                return "ℹ️";
            case ErrorTypes.ERROR:
            default:
                return "❌";
        }
    };

    return (
        <div
            className={`p-3 mb-4 rounded-md border ${getClassName()} flex justify-between items-center animate-fadeIn`}
            role={type === ErrorTypes.ERROR ? "alert" : "status"}
            aria-live={type === ErrorTypes.ERROR ? "assertive" : "polite"}
        >
            <div className="flex items-center">
                <span className="mr-2">{getIcon()}</span>
                <p>{message}</p>
            </div>
            {dismissible && (
                <button
                    onClick={handleDismiss}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                    aria-label="Dismiss"
                >
                    ×
                </button>
            )}
        </div>
    );
};

/**
 * Hook personalizado para gestionar errores en formularios
 * @param {Object} initialErrors - Estado inicial de errores
 * @returns {Array} - [errors, setError, clearError, clearAllErrors]
 */
export const useFormErrors = (initialErrors = {}) => {
    const [errors, setErrors] = useState(initialErrors);

    const setError = (field, message) => {
        setErrors(prev => ({ ...prev, [field]: message }));
    };

    const clearError = (field) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const clearAllErrors = () => {
        setErrors({});
    };

    return [errors, setError, clearError, clearAllErrors];
};

/**
 * Hook personalizado para gestionar mensajes de estado de formularios
 * @param {Object} initialStatus - Estado inicial
 * @returns {Array} - [formStatus, setFormStatus, clearFormStatus]
 */
export const useFormStatus = (initialStatus = { message: '', type: '' }) => {
    const [formStatus, setFormStatus] = useState(initialStatus);

    const setStatus = (message, type = ErrorTypes.ERROR) => {
        setFormStatus({ message, type });
    };

    const clearStatus = () => {
        setFormStatus({ message: '', type: '' });
    };

    return [formStatus, setStatus, clearStatus];
};

/**
 * Componente para mostrar errores de formulario bajo un campo específico
 */
export const FormFieldError = ({ error }) => {
    if (!error) return null;

    return (
        <p className="text-red-500 text-sm mt-1" role="alert">
            {error}
        </p>
    );
};

/**
 * Componente para mostrar mensajes de estado global de un formulario
 */
export const FormStatusMessage = ({ status, onDismiss }) => {
    if (!status.message) return null;

    return (
        <ErrorHandler
            message={status.message}
            type={status.type}
            dismissible={true}
            onDismiss={onDismiss}
        />
    );
};