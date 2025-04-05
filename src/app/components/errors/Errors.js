export default function errorHandler(error) {
    const errorMessage = error.message || 'Error desconocido';
    const errorCode = error.status || 500;

    switch (errorMessage) {
        // 401 - No autorizado
        case 'No se proporcionó token de autenticación':
            return { autenticationError: 'No se proporcionó token de autenticación' };
        case 'Token de autenticación inválido':
            return { autenticationError: 'Token de autenticación inválido' };
        case 'El correo electrónico no ha sido validado':
            return { validationError: 'El correo electrónico no ha sido validado' };
        case 'Contraseña incorrecta':
            return { account: 'Correo o contraseña incorrectos' };
        case 'Código de verificación inválido':
            return { account: 'Código de verificación inválido' };
        case 'Número máximo de intentos excedido':
            return { account: 'Número máximo de intentos excedido' };
        case 'Cuenta bloqueada por demasiados intentos fallidos':
            return { account: 'Cuenta bloqueada por demasiados intentos fallidos' };

        // 403 - Prohibido
        case 'No tienes permisos para realizar esta acción':
            return { autenticationError: 'No tienes permisos para realizar esta acción' };
        case 'Acción no autorizada':
            return { autenticationError: 'Acción no autorizada' };
        case 'El TFG no está verificado':
            return { tfg: 'El TFG no está verificado' };

        // 400 - Solicitudes incorrectas
        case 'ID inválido':
            return { invalidId: 'ID inválido' };
        case 'Formato de año inválido. Debe ser XX/XX':
            return { formatError: 'Formato de año inválido. Debe ser XX/XX' };
        case 'No se ha subido ningún archivo':
            return { fileError: 'No se ha subido ningún archivo' };
        case 'Tipo de archivo inválido. Solo se aceptan archivos PDF':
            return { fileError: 'Tipo de archivo inválido. Solo se aceptan archivos PDF' };
        case 'URL de archivo inválida':
            return { fileError: 'URL de archivo inválida' };

        // 404 - Recursos no encontrados
        case 'El usuario no existe':
            return { account: 'Correo o contraseña incorrectos' };
        case 'El TFG no existe':
            return { tfg: 'El TFG no existe' };
        case 'No se encontró el archivo del TFG':
            return { tfg: 'No se encontró el archivo del TFG' };
        case 'No se encontró el tutor':
            return { advisor: 'No se encontró el tutor' };
        case 'No se encontró el grado académico':
            return { degree: 'No se encontró el grado académico' };
        case 'No se encontró el año académico':
            return { year: 'No se encontró el año académico' };
        case 'No se encontró el CID en la URL':
            return { tfg: 'No se encontró el CID en la URL' };

        // 409 - Conflictos
        case 'El correo electrónico ya está registrado':
            return { account: 'El correo electrónico ya está registrado' };
        case 'El grado académico ya existe':
            return { degree: 'El grado académico ya existe' };
        case 'El año académico ya existe':
            return { year: 'El año académico ya existe' };
        case 'El tutor ya existe':
            return { advisor: 'El tutor ya existe' };
        case 'La nueva contraseña debe ser diferente a la actual':
            return { account: 'La nueva contraseña debe ser diferente a la actual' };
        case 'El grado académico está asociado a TFGs existentes':
            return { degree: 'El grado académico está asociado a TFGs existentes' };
        case 'El año académico está asociado a TFGs existentes':
            return { year: 'El año académico está asociado a TFGs existentes' };
        case 'El tutor está asociado a TFGs existentes':
            return { advisor: 'El tutor está asociado a TFGs existentes' };

        // 422 - Error de validación
        case 'Error de validación en los datos proporcionados':
            return { validation: 'Error de validación en los datos proporcionados' };

        // 500 - Errores internos
        case 'Error al subir el archivo':
            return { fileError: 'Error al subir el archivo' };
        case 'Error al obtener el archivo':
            return { fileError: 'Error al obtener el archivo' };
        case 'Error en la API de Pinata':
            return { fileError: 'Error en la API de Pinata' };
        case 'Error al obtener archivo de Pinata':
            return { fileError: 'Error al obtener archivo de Pinata' };
        case 'Error interno del servidor':
            return { serverError: 'Error interno del servidor' };

        // Default
        default:
            return { server: errorMessage || 'Ocurrió un error inesperado' };
    }
}
