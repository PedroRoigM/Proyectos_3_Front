import { toast } from 'react-hot-toast';
import Router from 'next/router';

/**
 * Manejador de errores para aplicación Next.js
 * Compatible con respuestas de API que devuelven los códigos de error definidos
 */
const ERROR_TYPES = {
    // Errores de autenticación y autorización
    NOT_TOKEN: { code: 401, message: 'No se proporcionó token de autenticación' },
    INVALID_TOKEN: { code: 401, message: 'Token de autenticación inválido' },
    EMAIL_NOT_VALIDATED: { code: 401, message: 'El correo electrónico no ha sido validado' },
    NOT_ALLOWED: { code: 403, message: 'No tienes permisos para realizar esta acción' },
    UNAUTHORIZED_ACTION: { code: 403, message: 'Acción no autorizada' },

    // Errores de validación
    VALIDATION_ERROR: { code: 422, message: 'Error de validación en los datos proporcionados' },
    INVALID_ID: { code: 400, message: 'ID inválido' },
    INVALID_YEAR_FORMAT: { code: 400, message: 'Formato de año inválido. Debe ser XX/XX' },

    // Errores de recursos
    USER_NOT_EXISTS: { code: 404, message: 'El usuario no existe' },
    TFG_NOT_EXISTS: { code: 404, message: 'El TFG no existe' },
    TFG_NOT_VERIFIED: { code: 403, message: 'El TFG no está verificado' },

    // Errores de duplicación
    EMAIL_ALREADY_EXISTS: { code: 409, message: 'El correo electrónico ya está registrado' },
    DEGREE_ALREADY_EXISTS: { code: 409, message: 'El grado académico ya existe' },
    YEAR_ALREADY_EXISTS: { code: 409, message: 'El año académico ya existe' },
    ADVISOR_ALREADY_EXISTS: { code: 409, message: 'El tutor ya existe' },

    // Errores de relaciones
    DEGREE_IN_USE: { code: 409, message: 'El grado académico está asociado a TFGs existentes' },
    YEAR_IN_USE: { code: 409, message: 'El año académico está asociado a TFGs existentes' },
    ADVISOR_IN_USE: { code: 409, message: 'El tutor está asociado a TFGs existentes' },

    // Errores de archivos
    NO_FILE_UPLOADED: { code: 400, message: 'No se ha subido ningún archivo' },
    INVALID_FILE_TYPE: { code: 400, message: 'Tipo de archivo inválido. Solo se aceptan archivos PDF' },
    ERROR_UPLOADING_FILE: { code: 500, message: 'Error al subir el archivo' },

    // Errores generales
    DEFAULT_ERROR: { code: 500, message: 'Error interno del servidor' }
};

// Mensajes personalizados para el usuario, más amigables que los mensajes técnicos
const USER_FRIENDLY_MESSAGES = {
    // Auth errors (401)
    NOT_TOKEN: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    INVALID_TOKEN: 'Tu sesión no es válida. Por favor, inicia sesión nuevamente.',
    EMAIL_NOT_VALIDATED: 'Necesitas verificar tu correo electrónico para continuar.',

    // Forbidden errors (403)
    NOT_ALLOWED: 'No tienes permisos suficientes para esta acción.',
    UNAUTHORIZED_ACTION: 'No estás autorizado para realizar esta acción.',
    TFG_NOT_VERIFIED: 'Este trabajo fin de grado aún no ha sido verificado.',

    // Not found errors (404)
    USER_NOT_EXISTS: 'No se ha encontrado el usuario solicitado.',
    TFG_NOT_EXISTS: 'No se ha encontrado el trabajo fin de grado solicitado.',

    // Conflict errors (409)
    EMAIL_ALREADY_EXISTS: 'Este correo electrónico ya está en uso. Prueba con otro o inicia sesión.',
    DEGREE_ALREADY_EXISTS: 'Este grado académico ya existe en el sistema.',
    YEAR_ALREADY_EXISTS: 'Este año académico ya está registrado.',
    ADVISOR_ALREADY_EXISTS: 'Este tutor ya está registrado en el sistema.',
    DEGREE_IN_USE: 'No es posible eliminar este grado porque tiene trabajos asociados.',
    YEAR_IN_USE: 'No es posible eliminar este año porque tiene trabajos asociados.',
    ADVISOR_IN_USE: 'No es posible eliminar este tutor porque tiene trabajos asignados.',

    // Validation errors (400, 422)
    VALIDATION_ERROR: 'Hay campos con información incorrecta en el formulario.',
    INVALID_ID: 'El identificador proporcionado no es válido.',
    INVALID_YEAR_FORMAT: 'El formato del año académico debe ser XX/XX.',
    NO_FILE_UPLOADED: 'Debes subir un archivo para continuar.',
    INVALID_FILE_TYPE: 'El archivo debe estar en formato PDF.',

    // Server errors (500)
    ERROR_UPLOADING_FILE: 'Ha ocurrido un problema al subir el archivo. Inténtalo de nuevo.',
    DEFAULT_ERROR: 'Ha ocurrido un error inesperado. Por favor, inténtalo más tarde.'
};

/**
 * Maneja errores de la API
 * @param {Object} error - Error de Axios
 * @param {Object} options - Opciones adicionales
 */
export const handleApiError = (error, options = {}) => {
    const {
        setFormErrors = null, // Función para establecer errores en un formulario
        setIsSubmitting = null, // Función para controlar estado de envío
        onAuthError = null, // Callback para errores de autenticación
        customErrorHandler = null // Manejador personalizado para casos específicos
    } = options;

    // Si hay un manejador personalizado y devuelve true, no continuamos con el manejo estándar
    if (customErrorHandler && customErrorHandler(error)) {
        return;
    }

    // Detener estado de carga del formulario si existe
    if (setIsSubmitting) {
        setIsSubmitting(false);
    }

    // Si no hay respuesta, probablemente es un error de red
    if (!error.response) {
        toast.error('Error de conexión. Comprueba tu conexión a internet.');
        console.error('Error de red:', error);
        return;
    }

    const { status, data } = error.response;

    // Extraer tipo de error y mensaje
    const errorType = data?.errorType || 'DEFAULT_ERROR';
    const serverMessage = data?.message || ERROR_TYPES[errorType]?.message || 'Error desconocido';

    // Obtener mensaje amigable para el usuario
    const userMessage = USER_FRIENDLY_MESSAGES[errorType] || serverMessage;

    // Log para debugging
    console.error(`Error ${status}: ${errorType} - ${serverMessage}`);

    // Manejar según el código de estado
    switch (status) {
        case 401: // Errores de autenticación
            toast.error(userMessage);

            if (errorType === 'NOT_TOKEN' || errorType === 'INVALID_TOKEN') {
                // Limpiar sesión
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');

                // Utilizar callback si se proporcionó, si no redirigir al login
                if (onAuthError) {
                    onAuthError(errorType);
                } else {
                    Router.push('/login');
                }
            } else if (errorType === 'EMAIL_NOT_VALIDATED') {
                Router.push('/verificar-email');
            }
            break;

        case 403: // Errores de autorización
            toast.error(userMessage);
            break;

        case 404: // Recursos no encontrados
            toast.error(userMessage);

            // Redireccionar en casos específicos
            if (errorType === 'TFG_NOT_EXISTS') {
                setTimeout(() => Router.push('/tfgs'), 2000);
            }
            break;

        case 409: // Conflictos (duplicados, etc.)
            toast.error(userMessage);

            // Si se trata de un email ya existente y tenemos función de setFormErrors
            if (errorType === 'EMAIL_ALREADY_EXISTS' && setFormErrors) {
                setFormErrors(prev => ({
                    ...prev,
                    email: 'Este correo electrónico ya está registrado'
                }));
            }
            break;

        case 400: // Errores de validación de cliente
        case 422: // Errores de validación de datos
            toast.error(userMessage);

            // Si hay errores detallados de validación y función para establecerlos
            if (data.errors && setFormErrors) {
                setFormErrors(data.errors);
            }
            break;

        case 500: // Errores del servidor
        default:
            toast.error(userMessage);

            // Opcional: enviar a servicio de monitoreo de errores
            // Si usas Sentry por ejemplo:
            // Sentry.captureException(error);
            break;
    }
};

/**
 * Hook para manejar errores en formularios
 * @param {Object} formRef - Referencia al formulario (opcional)
 * @returns {Object} - Métodos y estado para manejo de errores
 */
export const useFormErrorHandler = (formRef = null) => {
    const [formErrors, setFormErrors] = React.useState({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Resalta visualmente los campos con error
    const highlightFieldErrors = () => {
        if (!formRef?.current) return;

        // Limpiar clases de error anteriores
        const previousErrorFields = formRef.current.querySelectorAll('.error-field');
        previousErrorFields.forEach(field => {
            field.classList.remove('error-field');
        });

        // Añadir clase de error a los campos con error
        Object.keys(formErrors).forEach(fieldName => {
            const field = formRef.current.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.classList.add('error-field');
            }
        });
    };

    // Efecto para resaltar campos con error cuando cambia formErrors
    React.useEffect(() => {
        highlightFieldErrors();
    }, [formErrors]);

    // Limpia todos los errores
    const clearErrors = () => {
        setFormErrors({});
    };

    // Limpia error de un campo específico
    const clearError = (fieldName) => {
        setFormErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    // Opciones para utilizar con handleApiError
    const errorHandlerOptions = {
        setFormErrors,
        setIsSubmitting
    };

    return {
        formErrors,
        setFormErrors,
        isSubmitting,
        setIsSubmitting,
        clearErrors,
        clearError,
        errorHandlerOptions
    };
};

/**
 * Componente HOC para envolver páginas que requieren autenticación
 */
export const withErrorHandling = (Component) => {
    return function WithErrorHandling(props) {
        // Referencia para el router
        const router = Router;

        // Función para manejar errores de autenticación
        const handleAuthError = () => {
            toast.error('Tu sesión ha expirado. Redirigiendo al login...');
            setTimeout(() => router.push('/login'), 2000);
        };

        // Pasar el controlador de errores como prop
        return (
            <Component
                {...props}
                handleApiError={(error, options = {}) =>
                    handleApiError(error, {
                        ...options,
                        onAuthError: handleAuthError
                    })
                }
            />
        );
    };
};