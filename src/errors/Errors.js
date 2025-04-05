export default function tfgErrorHandler(error) {
    const errorMessage = error.response?.data?.message || 'Error desconocido';
    const errorCode = error.response?.status || 500;

    switch (errorMessage) {
        // 401 - No autorizado
        case 'No se proporcionó token de autenticación':
            return { tfg: 'No se proporcionó token de autenticación' };
        case 'Token de autenticación inválido':
            return { tfg: 'Token de autenticación inválido' };
        case 'El correo electrónico no ha sido validado':
            return { tfg: 'El correo electrónico no ha sido validado' };
        case 'Contraseña incorrecta':
            return { tfg: 'Contraseña incorrecta' };
        case 'Código de verificación inválido':
            return { tfg: 'Código de verificación inválido' };
        case 'Número máximo de intentos excedido':
            return { tfg: 'Número máximo de intentos excedido' };
        case 'Cuenta bloqueada por demasiados intentos fallidos':
            return { tfg: 'Cuenta bloqueada por demasiados intentos fallidos' };

        // 403 - Prohibido
        case 'No tienes permisos para realizar esta acción':
            return { tfg: 'No tienes permisos para realizar esta acción' };
        case 'Acción no autorizada':
            return { tfg: 'Acción no autorizada' };
        case 'El TFG no está verificado':
            return { tfg: 'El TFG no está verificado' };

        // 400 - Solicitudes incorrectas
        case 'ID inválido':
            return { tfg: 'ID inválido' };
        case 'Formato de año inválido. Debe ser XX/XX':
            return { tfg: 'Formato de año inválido. Debe ser XX/XX' };
        case 'No se ha subido ningún archivo':
            return { tfg: 'No se ha subido ningún archivo' };
        case 'Tipo de archivo inválido. Solo se aceptan archivos PDF':
            return { tfg: 'Tipo de archivo inválido. Solo se aceptan archivos PDF' };
        case 'URL de archivo inválida':
            return { tfg: 'URL de archivo inválida' };

        // 404 - Recursos no encontrados
        case 'El usuario no existe':
            return { tfg: 'El usuario no existe' };
        case 'El TFG no existe':
            return { tfg: 'El TFG no existe' };
        case 'No se encontró el archivo del TFG':
            return { tfg: 'No se encontró el archivo del TFG' };
        case 'No se encontró el tutor':
            return { tfg: 'No se encontró el tutor' };
        case 'No se encontró el grado académico':
            return { tfg: 'No se encontró el grado académico' };
        case 'No se encontró el año académico':
            return { tfg: 'No se encontró el año académico' };
        case 'No se encontró el CID en la URL':
            return { tfg: 'No se encontró el CID en la URL' };

        // 409 - Conflictos
        case 'El correo electrónico ya está registrado':
            return { tfg: 'El correo electrónico ya está registrado' };
        case 'El grado académico ya existe':
            return { tfg: 'El grado académico ya existe' };
        case 'El año académico ya existe':
            return { tfg: 'El año académico ya existe' };
        case 'El tutor ya existe':
            return { tfg: 'El tutor ya existe' };
        case 'La nueva contraseña debe ser diferente a la actual':
            return { tfg: 'La nueva contraseña debe ser diferente a la actual' };
        case 'El grado académico está asociado a TFGs existentes':
            return { tfg: 'El grado académico está asociado a TFGs existentes' };
        case 'El año académico está asociado a TFGs existentes':
            return { tfg: 'El año académico está asociado a TFGs existentes' };
        case 'El tutor está asociado a TFGs existentes':
            return { tfg: 'El tutor está asociado a TFGs existentes' };

        // 422 - Error de validación
        case 'Error de validación en los datos proporcionados':
            return { tfg: 'Error de validación en los datos proporcionados' };

        // 500 - Errores internos
        case 'Error al subir el archivo':
            return { tfg: 'Error al subir el archivo' };
        case 'Error al obtener el archivo':
            return { tfg: 'Error al obtener el archivo' };
        case 'Error en la API de Pinata':
            return { tfg: 'Error en la API de Pinata' };
        case 'Error al obtener archivo de Pinata':
            return { tfg: 'Error al obtener archivo de Pinata' };
        case 'Error al convertir PDF a imágenes':
            return { tfg: 'Error al convertir PDF a imágenes' };
        case 'Error interno del servidor':
            return { tfg: 'Error interno del servidor' };

        // Default
        default:
            console.error(`Error ${errorCode}: ${errorMessage}`);
            return { tfg: errorMessage || 'Ocurrió un error inesperado' };
    }
}
