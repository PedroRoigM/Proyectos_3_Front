const handleHttpError = (error) => {
    if (error.message.includes("Failed to fetch")) {
        alert("Error de conexión. Verifica tu internet.");
        return;
    }

    const statusMatch = error.message.match(/\d{3}/); // Extraer el código de estado HTTP
    const statusCode = statusMatch ? parseInt(statusMatch[0]) : null;

    switch (statusCode) {
        case 400:
            alert("Error 400: Solicitud incorrecta. Verifica los datos enviados.");
            break;
        case 401:
            alert("Error 401: No autorizado. Inicia sesión nuevamente.");
            break;
        case 403:
            alert("Error 403: No tienes permisos para realizar esta acción.");
            break;
        case 404:
            alert("Error 404: Recurso no encontrado.");
            break;
        case 500:
            alert("Error 500: Problema en el servidor. Intenta más tarde.");
            break;
        default:
            alert("Ocurrió un error desconocido. Inténtalo más tarde.");
            break;
    }
};
