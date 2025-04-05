'use server'


export default function tfgErrorHandler(error) {
    // Manejo de errores para el TFG
    const errorMessage = error.response?.data?.message || 'Error desconocido';
    const errorCode = error.response?.status || 500;

    // Aquí puedes manejar los errores específicos según el código de error
    switch (errorCode) {
        case 400:
            return { tfg: "Solicitud incorrecta" };
            break;
        case 401:
            console.error('Error 401: No autorizado', errorMessage);
            break;
        case 403:
            console.error('Error 403: Prohibido', errorMessage);
            break;
        case 404:
            console.error('Error 404: No encontrado', errorMessage);
            break;
        case 500:
            console.error('Error 500: Error interno del servidor', errorMessage);
            break;
        default:
            console.error(`Error ${errorCode}: ${errorMessage}`);
    }
}