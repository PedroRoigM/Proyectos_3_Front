// Este archivo define una función para realizar una solicitud HTTP GET al servidor.
// Se utiliza para obtener una lista de nombres de TFGs (Trabajos de Fin de Grado).

'use server'; // Indica que esta función se ejecuta en el servidor.
import { cookies } from "next/headers"; // Importa la utilidad para manejar cookies en Next.js.

export default async function GetTFGsNames() {
    try {
        // Construir la URL del endpoint para obtener los nombres de los TFGs.
        const url = `${process.env.SERVER_URL}/tfgs/names`;

        // Obtener el token de autenticación desde las cookies.
        const token = await cookies().then(c => c.get('bytoken')?.value);

        // Si no se encuentra el token, lanzar un error.
        if (!token) {
            throw new Error('Token not found'); // Error personalizado si no hay token.
        }

        // Realizar la solicitud HTTP GET al servidor.
        const response = await fetch(url, {
            method: 'GET', // Método HTTP para obtener recursos.
            headers: {
                'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud es JSON.
                'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado de autorización.
            },
        });

        // Si la respuesta no es exitosa (status >= 400), lanzar un error.
        if (!response.ok) {
            throw new Error(response.statusText); // Usa el texto del estado como mensaje de error.
        }

        // Parsear la respuesta como JSON y devolver los datos.
        const data = await response.json();
        console.log(data); // Log para depuración.
        return data; // Devuelve la lista de nombres de TFGs obtenida del servidor.
    } catch (err) {
        // Si ocurre un error, mostrarlo en la consola para depuración.
        console.log(err);
    }
}