'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ErrorHandler, ErrorTypes } from './enhanced-error-handler';

// Crear el contexto
const NotificationContext = createContext(null);

// ID único para notificaciones
let notificationId = 0;

/**
 * Proveedor de notificaciones para la aplicación
 */
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    // Agregar una nueva notificación
    const addNotification = useCallback((message, type = ErrorTypes.INFO, timeout = 5000) => {
        const id = ++notificationId;

        setNotifications(prev => [
            ...prev,
            { id, message, type, timeout }
        ]);

        // Eliminar automáticamente después del tiempo de espera
        if (timeout > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, timeout);
        }

        return id;
    }, []);

    // Eliminar una notificación por ID
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    // Métodos de conveniencia para diferentes tipos de notificaciones
    const showSuccess = useCallback((message, timeout = 5000) => {
        return addNotification(message, ErrorTypes.SUCCESS, timeout);
    }, [addNotification]);

    const showError = useCallback((message, timeout = 8000) => {
        return addNotification(message, ErrorTypes.ERROR, timeout);
    }, [addNotification]);

    const showWarning = useCallback((message, timeout = 6000) => {
        return addNotification(message, ErrorTypes.WARNING, timeout);
    }, [addNotification]);

    const showInfo = useCallback((message, timeout = 4000) => {
        return addNotification(message, ErrorTypes.INFO, timeout);
    }, [addNotification]);

    // Valor a exponer en el contexto
    const value = {
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
}

/**
 * Componente para mostrar todas las notificaciones activas
 */
function NotificationContainer() {
    const { notifications, removeNotification } = useContext(NotificationContext);

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {notifications.map(({ id, message, type }) => (
                <ErrorHandler
                    key={id}
                    message={message}
                    type={type}
                    dismissible={true}
                    onDismiss={() => removeNotification(id)}
                />
            ))}
        </div>
    );
}

/**
 * Hook para usar el sistema de notificaciones en cualquier componente
 */
export function useNotification() {
    const context = useContext(NotificationContext);

    if (context === null) {
        throw new Error('useNotification debe usarse dentro de un NotificationProvider');
    }

    return context;
}