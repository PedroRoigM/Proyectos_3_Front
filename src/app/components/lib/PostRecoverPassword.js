'use server';
import { handleApiError } from "../errors/api-error-service";

export default async function PostRecoverPassword(email) {
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
        return { ...data, success: true };
    } catch (error) {
        console.error("Error recovering password:", error);

        // Manejar errores de timeout específicamente
        if (error.name === 'AbortError') {
            return { account: 'La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.' };
        }

        // Manejar otros errores
        return { account: 'Ha ocurrido un error al procesar la solicitud. Por favor, inténtalo de nuevo.', success: false };
    }
}