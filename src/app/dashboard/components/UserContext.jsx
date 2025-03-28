// Este archivo define un contexto de usuario para gestionar el estado global del usuario en la aplicación.
// El contexto permite acceder al rol del usuario y su estado de carga en cualquier parte de la aplicación.
// Utiliza un token almacenado en las cookies para determinar el rol del usuario y actualizar el estado global.

'use client'; // Indica que este componente se ejecuta en el cliente (Next.js).

import { createContext, useContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken'; // Biblioteca para decodificar tokens JWT.

// Crear el contexto de usuario
const UserContext = createContext(null);

// Hook personalizado para usar el contexto
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe usarse dentro de un UserProvider'); // Asegura que el hook se use dentro del proveedor.
    }
    return context;
};

// Proveedor del contexto
export function UserProvider({ children }) {
    const [user, setUser] = useState({
        role: null, // Rol del usuario (por defecto, null).
        isLoading: true, // Indica si los datos del usuario están cargando.
    });

    useEffect(() => {
        // Función para obtener y decodificar el token desde las cookies.
        const getUserFromToken = () => {
            try {
                const token = document.cookie
                    .split('; ') // Divide las cookies en un array.
                    .find(row => row.startsWith('bytoken=')) // Busca la cookie con el nombre 'bytoken'.
                    ?.split('=')[1]; // Obtiene el valor del token.

                if (token) {
                    const decoded = jwt.decode(token); // Decodifica el token JWT.

                    // Establece el rol del usuario desde el token.
                    setUser({
                        role: decoded?.role || 'user', // Si no hay rol, se asigna 'user' por defecto.
                        isLoading: false, // Finaliza el estado de carga.
                    });
                } else {
                    // Si no hay token, establece el usuario como no autenticado.
                    setUser({
                        role: null,
                        isLoading: false,
                    });
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error); // Manejo de errores al decodificar el token.
                setUser({
                    role: null, // Si ocurre un error, el usuario no tiene rol.
                    isLoading: false, // Finaliza el estado de carga.
                });
            }
        };

        getUserFromToken(); // Llama a la función para obtener el usuario al montar el componente.
    }, []); // El efecto se ejecuta solo una vez al montar el componente.

    return (
        // Proveedor del contexto que pasa el estado del usuario a los componentes hijos.
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}