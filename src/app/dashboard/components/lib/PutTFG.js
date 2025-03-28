// Este archivo define una función para realizar una solicitud HTTP PUT a un servidor.
// Se utiliza para actualizar un TFG (Trabajo de Fin de Grado) en el servidor.
// La función recibe el ID del TFG y los datos del formulario como parámetros.

'use server'; // Indica que esta función se ejecuta en el servidor.
import { cookies } from "next/headers"; // Importa la utilidad para manejar cookies en Next.js.

export default async function PutTFG(id, dataForm) {
    try {
        // Construir la URL del endpoint para actualizar el TFG.
        const url = `${process.env.SERVER_URL}/tfgs/${id}`;
        
        // Convertir los datos del formulario a una cadena JSON.
        const body = JSON.stringify(dataForm);
        
        // Obtener el token de autenticación desde las cookies.
        const token = await cookies().then(c => c.get('bytoken')?.value);

        // Si no se encuentra el token, lanzar un error.
        if (!token) {
            throw new Error('NOT_FOUND_TOKEN'); // Error personalizado si no hay token.
        }

        // Realizar la solicitud HTTP PUT al servidor.
        const response = await fetch(url, {
            method: 'PUT', // Método HTTP para actualizar recursos.
            headers: {
                'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud es JSON.
                'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado de autorización.
            },
            body: body, // Cuerpo de la solicitud con los datos del formulario.
        });

        // Si la respuesta no es exitosa (status >= 400), lanzar un error.
        if (!response.ok) {
            throw new Error(response.statusText); // Usa el texto del estado como mensaje de error.
        }

        // Parsear la respuesta como JSON y devolver los datos.
        const data = await response.json();
        return data; // Devuelve los datos obtenidos del servidor.
    } catch (err) {
        // Si ocurre un error, devolver `null` como resultado.
        console.error("Error en PutTFG:", err.message); // Log para depuración.
        return null;
    }
}