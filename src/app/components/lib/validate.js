'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { handleApiError } from "../errors/api-error-service";

export default async function PatchValidation(code) {
    try {
        const url = `${process.env.SERVER_URL}/users/validate`;
        const token = await cookies().get('bytoken')?.value;

        if (!token) {
            throw new Error('Token not found');
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

        // Redireccionar a la página de inicio
        redirect('/');

    } catch (error) {
        console.error("Error validating user:", error);

        // Manejar errores de timeout específicamente
        if (error.name === 'AbortError') {
            return { account: 'La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.' };
        }

        // Manejar error de token no encontrado
        if (error.message === 'Token not found') {
            redirect('/');
            return null;
        }

        // Manejar otros errores
        return { account: 'Ha ocurrido un error al validar el código. Por favor, inténtalo de nuevo.' };
    }
}