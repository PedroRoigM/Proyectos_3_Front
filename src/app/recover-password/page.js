'use client';
import { useState } from "react";
import PostRecoverPassword from "../components/lib/PostRecoverPassword";
import PatchRecoverPassword from "../components/lib/PatchRecoverPassword";
import { recoverPasswordStyles, inputClassName } from "../components/styles/recover-password";
import {
    ErrorTypes,
    useFormErrors,
    useFormStatus,
    FormStatusMessage,
    FormFieldError
} from "../components/errors/enhanced-error-handler";
import { useApiError } from "../components/errors/api-error-hook";
import { validateRecoverPasswordForm } from "../components/errors/FormValidation";

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
    });
    const [step, setStep] = useState(1);

    // Usar los nuevos hooks para el manejo de errores
    const [errors, setError, clearError, clearAllErrors] = useFormErrors({});
    const [formStatus, setFormStatus, clearFormStatus] = useFormStatus();
    const { loading, executeRequest } = useApiError();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        clearError(name);
    }

    const handleSubmit = async () => {
        clearAllErrors();
        clearFormStatus();

        // Validar según el paso actual
        const validationErrors = validateRecoverPasswordForm(formData, step);
        if (Object.keys(validationErrors).length > 0) {
            // Agregar cada error de validación al estado
            Object.entries(validationErrors).forEach(([field, message]) => {
                setError(field, message);
            });
            return;
        }

        if (step === 1) {
            // Paso 1: Solicitar código de recuperación
            const response = await executeRequest(
                async () => await PostRecoverPassword(formData.email),
                {
                    loadingMessage: 'Enviando código...',
                    errorMessage: 'Ha ocurrido un error al enviar el código. Inténtalo de nuevo.'
                }
            );

            if (!response || !response.success) {
                if (response && response.account) {
                    setFormStatus(response.account, ErrorTypes.ERROR);
                } else {
                    setFormStatus('El email no existe o ha ocurrido un error', ErrorTypes.ERROR);
                }
                return;
            }

            // Avanzar al siguiente paso
            setFormStatus('Código enviado con éxito. Revisa tu correo electrónico.', ErrorTypes.SUCCESS);
            setStep(2);

        } else if (step === 2) {
            // Paso 2: Cambiar contraseña con el código
            const response = await executeRequest(
                async () => await PatchRecoverPassword(formData),
                {
                    loadingMessage: 'Cambiando contraseña...',
                    errorMessage: 'Ha ocurrido un error al cambiar la contraseña. Inténtalo de nuevo.'
                }
            );

            if (!response || response.code || response.account) {
                if (response && response.code) {
                    setError('code', response.code);
                }
                if (response && response.account) {
                    setError('password', response.account);
                }
                return;
            }

            // Mostrar mensaje de éxito y avanzar al paso final
            setFormStatus('Contraseña cambiada con éxito', ErrorTypes.SUCCESS);
            setStep(3);
        }
    }

    const handleRollback = () => {
        clearAllErrors();
        clearFormStatus();

        if (step === 1) {
            window.location.href = '/';
            return;
        }

        if (step === 2) {
            setFormData({
                email: formData.email,
                code: '',
                password: '',
            });
        }

        setStep(step - 1);
    }

    return (
        <div className={recoverPasswordStyles.layout.container}>
            <div className={recoverPasswordStyles.layout.wrapper}>
                <div className={recoverPasswordStyles.layout.formContainer}>
                    <h1 className={recoverPasswordStyles.headings.title}>Recuperar contraseña</h1>

                    <FormStatusMessage
                        status={formStatus}
                        onDismiss={clearFormStatus}
                    />

                    {step === 1 && (
                        <div>
                            <p className={recoverPasswordStyles.headings.paragraph}>Introduce tu correo electrónico</p>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClassName(errors.account)}
                                disabled={loading}
                            />
                            <FormFieldError error={errors.account} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className={recoverPasswordStyles.form.container}>
                            <div className={recoverPasswordStyles.form.section}>
                                <p>Introduce el código</p>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className={inputClassName(errors.code)}
                                    disabled={loading}
                                />
                                <FormFieldError error={errors.code} />
                            </div>
                            <div>
                                <p>Introduce tu nueva contraseña</p>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={inputClassName(errors.account)}
                                    disabled={loading}
                                />
                                <FormFieldError error={errors.account} />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <p>Contraseña cambiada correctamente</p>
                    )}

                    <div className={recoverPasswordStyles.buttons.container}>
                        {step !== 3 && (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={recoverPasswordStyles.buttons.primary}
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : 'Enviar'}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleRollback}
                            className={recoverPasswordStyles.buttons.secondary}
                            disabled={loading}
                        >
                            {step === 3 ? 'Ir a login' : 'Volver'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}