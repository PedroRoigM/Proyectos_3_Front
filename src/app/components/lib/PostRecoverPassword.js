'use server';
import { handleApiError } from "../errors/api-error-service";

async function sendFetch(email) {
    try {
        const url = `${process.env.SERVER_URL}/users/recover-password`;
        const body = JSON.stringify({ email });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
            signal: AbortSignal.timeout(10000) // 10 segundos
        });

        if (!response.ok) {
            const data = await response.json();
            return handleApiError(data);
        }

        const data = await response.json();
        return {
            success: true,
            data: {
                ...data,
                message: 'Código de recuperación enviado correctamente'
            }
        };
    } catch (error) {
        console.error("Error recovering password:", error);

        // Manejar errores de timeout específicamente
        if (error.name === 'AbortError') {
            return {
                success: false,
                error: {
                    account: 'La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.'
                }
            };
        }

        // Manejar otros errores
        return {
            success: false,
            error: {
                account: 'Ha ocurrido un error al procesar la solicitud. Por favor, inténtalo de nuevo.'
            }
        };
    }
}

export default async function PostRecoverPassword(email) {
    try {
        const result = await sendFetch(email);

        // Manejar diferentes escenarios de resultado
        if (!result.success) {
            // Si hay un error, devolver el objeto de error
            return result.error;
        }

        // Si fue exitoso, devolver los datos
        return result.data;
    } catch (error) {
        console.error("Unhandled error in PostRecoverPassword:", error);

        // Devolver un error genérico en caso de excepción inesperada
        return {
            success: false,
            account: 'Ha ocurrido un error inesperado al solicitar recuperación de contraseña. Por favor, inténtalo de nuevo.'
        };
    }
}