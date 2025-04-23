'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { handleApiError } from "../errors/api-error-service";

async function sendFetch(dataForm) {
    try {
        const url = `${process.env.SERVER_URL}/users/register`;
        const body = JSON.stringify(dataForm);

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

        const responseData = await response.json();
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

        // Retornar datos para posterior manejo
        return {
            success: true,
            data: responseData.data
        };
    } catch (error) {
        console.error("Error registering user:", error);

        // Manejar errores de timeout específicamente
        if (error.name === 'AbortError') {
            return {
                success: false,
                error: {
                    email: 'La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.'
                }
            };
        }

        // Manejar otros errores
        return {
            success: false,
            error: {
                email: 'Ha ocurrido un error durante el registro. Por favor, inténtalo de nuevo.'
            }
        };
    }
}

export default async function PostRegister(dataForm) {
    try {
        const result = await sendFetch(dataForm);

        // Manejar diferentes escenarios de resultado
        if (!result.success) {
            // Si hay un error, devolver el objeto de error
            return result.error;
        }

        // Usar un throw directo para redirección
        throw redirect('/validation');
    } catch (error) {
        // Manejar específicamente el error de redirección de Next.js
        if (error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
            // Este es un caso especial de redirección, no un error real
            throw error;
        }

        console.error("Unhandled error in PostRegister:", error);

        // Devolver un error genérico en caso de excepción inesperada
        return {
            email: 'Ha ocurrido un error inesperado durante el registro. Por favor, inténtalo de nuevo.'
        };
    }
}