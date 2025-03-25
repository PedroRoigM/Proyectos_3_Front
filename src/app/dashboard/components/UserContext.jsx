'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

// Crear el contexto de usuario
const UserContext = createContext(null);

// Hook personalizado para usar el contexto
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe usarse dentro de un UserProvider');
    }
    return context;
};

// Proveedor del contexto
export function UserProvider({ children }) {
    const [user, setUser] = useState({
        role: null,
        isLoading: true,
    });

    useEffect(() => {
        // Función para obtener y decodificar el token
        const getUserFromToken = () => {
            try {
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('bytoken='))
                    ?.split('=')[1];

                if (token) {
                    const decoded = jwt.decode(token);

                    // Establecer el rol del usuario desde el token
                    setUser({
                        role: decoded?.role || 'user',
                        isLoading: false,
                    });
                } else {
                    setUser({
                        role: null,
                        isLoading: false,
                    });
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                setUser({
                    role: null,
                    isLoading: false,
                });
            }
        };

        getUserFromToken();
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}