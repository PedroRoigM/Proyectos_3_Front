'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { handleApiError } from "../errors/api-error-service";

async function sendFetch(code) {
    try {
        const url = `${process.env.SERVER_URL}/users/validate`;
        const token = await cookies().get('bytoken')?.value;

        if (!token) {
            return {
                success: false,
                error: {
                    account: 'No se encontró el token de autenticación.'
                }
            };
        }

        const body = JSON.stringify({ code: code });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: body,
            signal: AbortSignal.timeout(10000) // 10 segundos
        });

        if (!response.ok) {
            const data = await response.json();
            return handleApiError(data);
        }

        // Borrar cookie
        (await cookies()).delete('bytoken');

        return {
            success: true
        };
    } catch (error) {
        console.error("Error validating user:", error);

        // Manejar errores de timeout específicamente
        if (error.name === 'AbortError') {
            return {
                success: false,
                error: {
                    account: 'La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.'
                }
            };
        }

        // Manejar error de token no encontrado
        if (error.message === 'Token not found') {
            return {
                success: false,
                error: {
                    account: 'No se encontró el token de autenticación.'
                }
            };
        }

        // Manejar otros errores
        return {
            success: false,
            error: {
                account: 'Ha ocurrido un error al validar el código. Por favor, inténtalo de nuevo.'
            }
        };
    }
}

export default async function PatchValidation(code) {
    try {
        const result = await sendFetch(code);

        // Manejar diferentes escenarios de resultado
        if (!result.success) {
            // Si hay un error, devolver el objeto de error
            return result.error;
        }

        // Usar un throw directo para redirección
        throw redirect('/');
    } catch (error) {
        // Manejar específicamente el error de redirección de Next.js
        if (error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
            // Este es un caso especial de redirección, no un error real
            throw error;
        }

        console.error("Unhandled error in PatchValidation:", error);

        // Devolver un error genérico en caso de excepción inesperada
        return {
            account: 'Ha ocurrido un error inesperado durante la validación. Por favor, inténtalo de nuevo.'
        };
    }
}