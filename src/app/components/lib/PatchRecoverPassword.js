'use server';
import { redirect } from "next/navigation";
import { handleApiError } from "../errors/api-error-service";

async function sendFetch(formData) {
    try {
        const url = `${process.env.SERVER_URL}/users/recover-password`;
        const body = JSON.stringify({
            email: formData.email,
            code: formData.code,
            password: formData.password,
        });

        const response = await fetch(url, {
            method: 'PATCH',
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

        return {
            success: true
        };
    } catch (error) {
        console.error("Error changing password:", error);

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
                account: 'Ha ocurrido un error al cambiar la contraseña. Por favor, inténtalo de nuevo.'
            }
        };
    }
}

export default async function PatchRecoverPassword(formData) {
    try {
        const result = await sendFetch(formData);

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

        console.error("Unhandled error in PatchRecoverPassword:", error);

        // Devolver un error genérico en caso de excepción inesperada
        return {
            account: 'Ha ocurrido un error inesperado al recuperar la contraseña. Por favor, inténtalo de nuevo.'
        };
    }
}