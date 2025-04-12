'use server';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Función de servidor para obtener el rol del usuario
export async function getUserRole() {
    try {
        const token = (await cookies()).get('bytoken')?.value;

        // Decodificar el token JWT
        const decodedToken = jwt.decode(token);
        return { role: decodedToken?.role || null };
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return { role: null };
    }
}