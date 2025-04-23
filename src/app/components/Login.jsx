"use client";

import { useState, useCallback } from 'react';
import PostLogin from './lib/login';
import { styles, inputClassName } from './styles/components';
import { validateLoginForm } from './errors/FormValidation';
import {
    ErrorTypes,
    useFormErrors,
    useFormStatus,
    FormStatusMessage,
    FormFieldError
} from './errors/enhanced-error-handler';
import { useApiError } from './errors/api-error-hook';
import { mapApiErrorsToFormErrors } from './errors/api-error-service';

export default function Login({ changeToRegister }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Usar los nuevos hooks para manejo de errores
    const [errors, setError, clearError, clearAllErrors] = useFormErrors({});
    const [formStatus, setFormStatus, clearFormStatus] = useFormStatus();
    const { loading, executeRequest } = useApiError();

    // Usar useCallback para evitar recreaciones innecesarias de funciones
    const handleChangeToRegister = useCallback((e) => {
        // Prevenir comportamiento por defecto si es un evento
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        // Llamar a la función proporcionada por el componente padre
        if (typeof changeToRegister === 'function') {
            changeToRegister();
        }
    }, [changeToRegister]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar el error cuando el usuario empieza a escribir
        clearError(name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearAllErrors();
        clearFormStatus();

        // Validar el formulario
        const validationErrors = validateLoginForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            // Agregar cada error de validación al estado de errores
            Object.entries(validationErrors).forEach(([field, message]) => {
                setError(field, message);
            });
            return;
        }

        // Ejecutar la solicitud de login
        const response = await executeRequest(
            async () => await PostLogin(formData),
            {
                loadingMessage: 'Iniciando sesión...',
                errorMessage: 'Ha ocurrido un error al iniciar sesión. Inténtalo de nuevo.'
            }
        );

        // Manejar la respuesta
        if (response && response.account) {
            // Mapear los errores de la API a errores de formulario
            const mappedErrors = mapApiErrorsToFormErrors(response);

            // Establecer errores mapeados
            Object.entries(mappedErrors).forEach(([field, message]) => {
                setError(field, message);
            });

            // Establecer mensaje de estado general
            setFormStatus(response.account, ErrorTypes.ERROR);
        }

        // La redirección la maneja PostLogin si todo va bien
    };

    return (
        <div className={styles.layout.flexCenter}>
            <div className={styles.container.form}>
                <h1 className={styles.headings.h1}>Login</h1>

                {/* Usar el nuevo componente para mostrar mensajes de estado */}
                <FormStatusMessage
                    status={formStatus}
                    onDismiss={clearFormStatus}
                />

                {loading && <p className={styles.form.loading}>Cargando...</p>}

                <form onSubmit={handleSubmit} className={styles.form.container}>
                    <div className={styles.form.group}>
                        <label className={styles.form.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClassName(errors.email)}
                            disabled={loading}
                        />
                        <FormFieldError error={errors.email} />
                    </div>

                    <div className={styles.form.group}>
                        <label className={styles.form.label}>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClassName(errors.password)}
                            disabled={loading}
                        />
                        <FormFieldError error={errors.password} />
                    </div>

                    <a href="/recover-password" className={styles.buttons.link + " block text-left"}>
                        ¿Has olvidado tu contraseña?
                    </a>

                    <button
                        type="submit"
                        className={styles.buttons.primary}
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>

                    <button
                        type="button"
                        onClick={handleChangeToRegister}
                        className={styles.buttons.link}
                        disabled={loading}
                    >
                        ¿No tiene cuenta?
                    </button>
                </form>
            </div>
        </div>
    );
}