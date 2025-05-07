'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import errorHandler from "../../../components/errors/Errors";

// Función de envío que maneja la petición a la API
async function sendFetch(id, file) {
    try {
        console.log("Subiendo archivo para TFG ID:", id);

        if (!id) {
            throw new Error('ID de TFG no proporcionado');
        }

        if (!file) {
            throw new Error('Archivo no proporcionado');
        }

        const url = `${process.env.SERVER_URL}/tfgs/pdf/${id}`;
        const token = await cookies().then(c => c.get('bytoken')?.value);

        if (!token) {
            throw new Error('Token not found');
        }

        // Crear el FormData
        const formData = new FormData();
        formData.append('file', file);

        console.log("Enviando archivo al servidor...");

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
                // No incluir 'Content-Type' cuando se envía un FormData
            },
            body: formData,
            signal: AbortSignal.timeout(30000) // 30 segundos de timeout
        });

        console.log("Respuesta del servidor:", response.status, response.statusText);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al subir archivo:", errorData);
            return {
                success: false,
                error: errorHandler(errorData)
            };
        }

        const responseData = await response.json();
        console.log("Archivo subido exitosamente:", responseData);

        return {
            success: true,
            data: responseData.data || responseData
        };
    } catch (err) {
        console.error("Error en PatchTfgFile:", err.message);

        // Manejar errores de timeout específicamente
        if (err.name === 'AbortError') {
            return {
                success: false,
                error: {
                    fileError: 'La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.'
                }
            };
        }

        return {
            success: false,
            error: {
                fileError: err.message || "Error al subir el archivo del TFG"
            }
        };
    }
}

// Función principal que maneja la lógica y redirección
export default async function PatchTfgFile(id, file) {
    try {
        const result = await sendFetch(id, file);

        // Manejar diferentes escenarios de resultado
        if (!result.success) {
            // Si hay un error, devolver el objeto de error
            return result.error;
        }
    } catch (error) {
        // Manejar específicamente el error de redirección de Next.js
        if (error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
            // Este es un caso especial de redirección, no un error real
            throw error;
        }

        console.error("Error no controlado en PatchTfgFile:", error);

        // Devolver un error genérico en caso de excepción inesperada
        return {
            fileError: 'Ha ocurrido un error inesperado al subir el archivo. Por favor, inténtalo de nuevo.'
        };
    }
    let redirectUrl = `/dashboard`;
    redirect(redirectUrl);
}