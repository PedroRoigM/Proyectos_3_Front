// Este archivo define una función para realizar una solicitud HTTP PATCH al servidor.
// Se utiliza para actualizar el archivo PDF asociado a un TFG (Trabajo de Fin de Grado).
// La función recibe el ID del TFG y el archivo como parámetros.

'use server'; // Indica que esta función se ejecuta en el servidor.
import { cookies } from "next/headers"; // Importa la utilidad para manejar cookies en Next.js.

export default async function PatchTfgFile(id, file) {
    try {
        // Construir la URL del endpoint para actualizar el archivo PDF del TFG.
        const url = `${process.env.SERVER_URL}/tfgs/pdf/${id}`;

        // Obtener el token de autenticación desde las cookies.
        const token = await cookies().then(c => c.get('bytoken')?.value);

        // Si no se encuentra el token, lanzar un error.
        if (!token) {
            throw new Error('NOT_FOUND_TOKEN'); // Error personalizado si no hay token.
        }

        // Crear un objeto FormData para enviar el archivo.
        const body = new FormData();
        body.append('file', file); // Agregar el archivo al FormData con la clave 'file'.

        // Realizar la solicitud HTTP PATCH al servidor.
        const response = await fetch(url, {
            method: 'PATCH', // Método HTTP para actualizar parcialmente un recurso.
            headers: {
                'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado de autorización.
            },
            body // Enviar el FormData como cuerpo de la solicitud.
        });

        console.log(response); // Log para depuración.

        // Si la respuesta no es exitosa (status >= 400), manejar el error.
        if (!response.ok) {
            let errorMessage = `Error ${response.status}: ${response.statusText}`; // Mensaje de error por defecto.
            try {
                // Intentar obtener un mensaje de error más detallado desde la respuesta JSON.
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (_) {
                // Si no se puede parsear JSON, usar el mensaje por defecto.
            }
            throw new Error(errorMessage); // Lanzar el error con el mensaje obtenido.
        }

        // Parsear la respuesta como JSON y devolver los datos.
        return await response.json();
    } catch (err) {
        // Si ocurre un error, mostrarlo en la consola para depuración.
        console.error("Error en PatchTfgFile:", err.message);
        return { error: err.message }; // Devolver un objeto con el mensaje de error.
    }
}