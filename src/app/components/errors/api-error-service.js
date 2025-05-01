'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Servicio para manejar errores de API
 * Extiende tu función errorHandler existente
 */
export async function handleApiError(error) {
    // Verifica si el error es un objeto o una cadena
    const errorMessage = error?.message || error || 'Error desconocido';
    const errorCode = error?.status || 500;

    // Organizar los errores por categorías para fácil mantenimiento
    // Errores de autenticación (401)
    const authErrors = {
        'No se proporcionó token de autenticación': async () => {
            (await cookies()).delete('bytoken');
            redirect('/');
        },
        'Token de autenticación inválido': async () => {
            (await cookies()).delete('bytoken');
            redirect('/');
        },
        'El correo electrónico no ha sido validado': async () => {
            (await cookies()).delete('bytoken');
            redirect('/');
        },
        'Contraseña incorrecta': () => ({ account: 'Correo o contraseña incorrectos' }),
        'Código de verificación inválido': () => ({ code: 'Código de verificación inválido' }),
        'Número máximo de intentos excedido': () => ({ account: 'Número máximo de intentos excedido' }),
        'Cuenta bloqueada por demasiados intentos fallidos': () => ({ account: 'Cuenta bloqueada por demasiados intentos fallidos' }),
    };

    // Errores de permisos (403)
    const permissionErrors = {
        'No tienes permisos para realizar esta acción': async () => {
            return { autenticationError: 'No tienes permisos para realizar esta acción' };
        },
        'Acción no autorizada': async () => {
            return { autenticationError: 'Acción no autorizada' };
        },
        'El TFG no está verificado': () => ({ tfg: 'El TFG no está verificado' }),
    };

    // Errores de validación (400)
    const validationErrors = {
        'ID inválido': () => ({ invalidId: 'ID inválido' }),
        'Formato de año inválido. Debe ser XX/XX': () => ({ formatError: 'Formato de año inválido. Debe ser XX/XX' }),
        'No se ha subido ningún archivo': () => ({ fileError: 'No se ha subido ningún archivo' }),
        'Tipo de archivo inválido. Solo se aceptan archivos PDF': () => ({ fileError: 'Tipo de archivo inválido. Solo se aceptan archivos PDF' }),
        'URL de archivo inválida': () => ({ fileError: 'URL de archivo inválida' }),
    };

    // Errores de recursos no encontrados (404)
    const notFoundErrors = {
        'El usuario no existe': () => ({ account: 'Correo o contraseña incorrectos' }),
        'El TFG no existe': () => ({ tfg: 'El TFG no existe' }),
        'No se encontró el archivo del TFG': () => ({ tfg: 'No se encontró el archivo del TFG' }),
        'No se encontró el tutor': () => ({ advisor: 'No se encontró el tutor' }),
        'No se encontró el grado académico': () => ({ degree: 'No se encontró el grado académico' }),
        'No se encontró el año académico': () => ({ year: 'No se encontró el año académico' }),
        'No se encontró el CID en la URL': () => ({ tfg: 'No se encontró el CID en la URL' }),
    };

    // Errores de conflicto (409)
    const conflictErrors = {
        'El correo electrónico ya está registrado': () => ({ account: 'El correo electrónico ya está registrado' }),
        'El grado académico ya existe': () => ({ degree: 'El grado académico ya existe' }),
        'El año académico ya existe': () => ({ year: 'El año académico ya existe' }),
        'El tutor ya existe': () => ({ advisor: 'El tutor ya existe' }),
        'La nueva contraseña debe ser diferente a la actual': () => ({ account: 'La nueva contraseña debe ser diferente a la actual' }),
        'El grado académico está asociado a TFGs existentes': () => ({ degree: 'El grado académico está asociado a TFGs existentes' }),
        'El año académico está asociado a TFGs existentes': () => ({ year: 'El año académico está asociado a TFGs existentes' }),
        'El tutor está asociado a TFGs existentes': () => ({ advisor: 'El tutor está asociado a TFGs existentes' }),
    };

    // Errores de validación (422)
    const processingErrors = {
        'Error de validación en los datos proporcionados': () => ({ validation: 'Error de validación en los datos proporcionados' }),
    };

    // Errores internos del servidor (500)
    const serverErrors = {
        'Error al subir el archivo': () => ({ fileError: 'Error al subir el archivo' }),
        'Error al obtener el archivo': () => ({ fileError: 'Error al obtener el archivo' }),
        'Error en la API de Pinata': () => ({ fileError: 'Error en la API de Pinata' }),
        'Error al obtener archivo de Pinata': () => ({ fileError: 'Error al obtener archivo de Pinata' }),
        'Error interno del servidor': () => ({ serverError: 'Error interno del servidor' }),
    };

    // Combinar todos los tipos de error
    const allErrors = {
        ...authErrors,
        ...permissionErrors,
        ...validationErrors,
        ...notFoundErrors,
        ...conflictErrors,
        ...processingErrors,
        ...serverErrors,
    };

    // Verificar si el error específico existe en nuestra lista
    if (errorMessage in allErrors) {
        return await allErrors[errorMessage]();
    }

    // Error por defecto
    return { server: errorMessage || 'Ocurrió un error inesperado' };
}

/**
 * Mapea objetos de error de API a un formato consistente para la UI
 * @param {Object} apiErrors - Objeto de errores de la API
 * @returns {Object} - Errores formateados para la UI
 */
export async function mapApiErrorsToFormErrors(apiErrors) {
    const formErrors = {};

    if (!apiErrors) return formErrors;

    // Mapeo de campos de API a campos de formulario
    const fieldMappings = {
        account: ['email', 'password', 'general'],
        validation: 'general',
        server: 'general',
        fileError: 'file',
        // Agregar más mapeos según sea necesario
    };

    // Recorrer todos los errores de la API
    Object.entries(apiErrors).forEach(([field, message]) => {
        if (field in fieldMappings) {
            const formFields = fieldMappings[field];
            if (Array.isArray(formFields)) {
                // Si un error de API debe mapearse a múltiples campos del formulario
                formFields.forEach(formField => {
                    formErrors[formField] = message;
                });
            } else {
                formErrors[fieldMappings[field]] = message;
            }
        } else {
            // Si no hay mapeo específico, usar el mismo nombre de campo
            formErrors[field] = message;
        }
    });

    return formErrors;
}