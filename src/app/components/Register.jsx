"use client";

import { useState, useCallback } from 'react';
import PostRegister from './lib/register';
import { styles, classNames } from './styles/components';
import { validateRegisterForm } from './errors/FormValidation';
import {
    ErrorTypes,
    useFormErrors,
    useFormStatus,
    FormStatusMessage,
    FormFieldError
} from './errors/enhanced-error-handler';
import { useApiError } from './errors/api-error-hook';
import { mapApiErrorsToFormErrors } from './errors/api-error-service';

export default function Register({ changeToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // Usar los nuevos hooks para el manejo de errores
    const [errors, setError, clearError, clearAllErrors] = useFormErrors({});
    const [formStatus, setFormStatus, clearFormStatus] = useFormStatus();
    const { loading, executeRequest } = useApiError();

    // Usar useCallback para evitar recreaciones innecesarias de funciones
    const handleChangeToLogin = useCallback((e) => {
        // Prevenir comportamiento por defecto si es un evento
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        // Llamar a la función proporcionada por el componente padre
        if (typeof changeToLogin === 'function') {
            changeToLogin();
        }
    }, [changeToLogin]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Actualizar formData
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar error específico del campo
        clearError(name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearAllErrors();
        clearFormStatus();

        // Validar formulario usando la función existente
        const validationErrors = validateRegisterForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            // Agregar cada error de validación al estado
            Object.entries(validationErrors).forEach(([field, message]) => {
                setError(field, message);
            });
            return;
        }

        // Ejecutar la solicitud de registro
        const response = await executeRequest(
            async () => await PostRegister(formData),
            {
                loadingMessage: 'Registrando usuario...',
                errorMessage: 'Ha ocurrido un error al registrar tu cuenta. Inténtalo de nuevo.'
            }
        );

        // Manejar la respuesta
        if (response && response.email) {
            // Error específico de email
            setFormStatus(response.email, ErrorTypes.ERROR);
            setError('email', response.email);
        } else if (response === null) {
            // Error general
            setFormStatus('Ha ocurrido un error al registrar tu cuenta. Inténtalo de nuevo.', ErrorTypes.ERROR);
        }

        // Si es exitoso, PostRegister manejará la redirección
    };

    return (
        <div className={styles.layout.flexCenter}>
            <div className={styles.container.form}>
                <h1 className={styles.headings.h1}>Registro</h1>

                {/* Usar el componente de estado del formulario */}
                <FormStatusMessage
                    status={formStatus}
                    onDismiss={clearFormStatus}
                />

                {loading && <p className={styles.form.loading}>Cargando...</p>}

                <form onSubmit={handleSubmit} className={styles.form.container}>
                    <div className={styles.form.group}>
                        <label className={styles.form.label}>Usuario</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleChange}
                            className={classNames(
                                styles.form.input.base,
                                errors.name ? styles.form.input.error : styles.form.input.valid
                            )}
                            disabled={loading}
                        />
                        <FormFieldError error={errors.name} />
                    </div>

                    <div className={styles.form.group}>
                        <label className={styles.form.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={classNames(
                                styles.form.input.base,
                                errors.email ? styles.form.input.error : styles.form.input.valid
                            )}
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
                            className={classNames(
                                styles.form.input.base,
                                errors.password ? styles.form.input.error : styles.form.input.valid
                            )}
                            disabled={loading}
                        />
                        <FormFieldError error={errors.password} />
                    </div>

                    <button
                        type="submit"
                        className={styles.buttons.primary}
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <button
                        type="button"
                        onClick={handleChangeToLogin}
                        className={styles.buttons.link}
                        disabled={loading}
                    >
                        ¿Ya tiene cuenta?
                    </button>
                </form>
            </div>
        </div>
    );
}