'use server';
import { redirect } from "next/navigation";
import { handleApiError } from "../errors/api-error-service";

export default async function PatchRecoverPassword(formData) {
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

        // Llevar al usuario a la página de login
        redirect('/');
        return { success: true };
    } catch (error) {
        console.error("Error changing password:", error);

        // Manejar errores de timeout específicamente
        if (error.name === 'AbortError') {
            return { account: 'La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.' };
        }

        // Manejar otros errores
        return { account: 'Ha ocurrido un error al cambiar la contraseña. Por favor, inténtalo de nuevo.', success: false };
    }
}