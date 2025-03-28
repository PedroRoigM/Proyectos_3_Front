// Este archivo define una función para realizar una solicitud HTTP POST al servidor.
// Se utiliza para obtener una lista paginada de TFGs (Trabajos de Fin de Grado) no verificados.
// La función recibe el número de página y datos de filtro como parámetros.

'use server'; // Indica que esta función se ejecuta en el servidor.
import { cookies } from "next/headers"; // Importa la utilidad para manejar cookies en Next.js.

export default async function GetUnverifiedTFGs(page_number, formData) {
    try {
        // Establecer valores predeterminados si no se proporcionan parámetros.
        page_number = page_number || 1; // Número de página predeterminado: 1.
        formData = formData || {}; // Datos de filtro predeterminados: objeto vacío.

        // Construir la URL del endpoint para obtener TFGs no verificados.
        const url = `${process.env.SERVER_URL}/tfgs/unverified/${page_number}`;

        // Obtener el token de autenticación desde las cookies.
        const token = await cookies().then(c => c.get('bytoken')?.value);

        // Si no se encuentra el token, lanzar un error.
        if (!token) {
            throw new Error('Token not found'); // Error personalizado si no hay token.
        }

        // Convertir los datos del formulario a una cadena JSON.
        const body = JSON.stringify(formData);

        // Realizar la solicitud HTTP POST al servidor.
        const response = await fetch(url, {
            method: 'POST', // Método HTTP para enviar datos y obtener recursos.
            headers: {
                'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud es JSON.
                'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado de autorización.
            },
            body: body // Cuerpo de la solicitud con los datos de filtro.
        });

        // Si la respuesta no es exitosa (status >= 400), lanzar un error.
        if (!response.ok) {
            throw new Error(response.statusText); // Usa el texto del estado como mensaje de error.
        }

        // Parsear la respuesta como JSON y devolver los datos.
        const data = response.json();
        return data; // Devuelve los datos obtenidos del servidor.
    } catch (err) {
        // Si ocurre un error, mostrarlo en la consola para depuración.
        console.log(err);
    }
}