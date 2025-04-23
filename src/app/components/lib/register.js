'use server';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { handleApiError } from "../errors/api-error-service";

/**
 * Función mejorada para el registro de usuarios
 * @param {Object} dataForm - Datos del formulario de registro
 */
export default async function PostRegister(dataForm) {
    try {
        const url = `${process.env.SERVER_URL}/users/register`;
        const body = JSON.stringify(dataForm);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
            // Agregar timeout para evitar esperas indefinidas
            signal: AbortSignal.timeout(10000) // 10 segundos
        });

        if (!response.ok) {
            const data = await response.json();
            return handleApiError(data);
        }

        const responseData = await response.json();
        console.log(responseData)
        // Verificar que tengamos un token en la respuesta
        const token = responseData?.data?.token;
        if (!token) {
            return handleApiError('Respuesta del servidor incompleta');
        }

        // Establecer la cookie
        (await cookies()).set({
            name: 'bytoken',
            value: token,
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 5, // 5 minutos
        });

        // Redirigir a la página de validación
        redirect('/validation');
    } catch (error) {
        console.error("Error registering user:", error);

        // Manejar errores de timeout específicamente
        if (error.name === 'AbortError') {
            return { email: 'La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.' };
        }

        // Manejar otros errores
        return { email: 'Ha ocurrido un error durante el registro. Por favor, inténtalo de nuevo.' };
    }
}