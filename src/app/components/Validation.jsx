'use client';
import { useState } from "react";
import { styles } from './styles/components';
import {
    ErrorTypes,
    useFormErrors,
    useFormStatus,
    FormStatusMessage,
    FormFieldError
} from './errors/enhanced-error-handler';
import { useApiError } from './errors/api-error-hook';

export default function Validation({ sendCode }) {
    // código de 6 dígitos
    const [code, setCode] = useState('');

    // Usar los nuevos hooks para el manejo de errores
    const [errors, setError, clearError, clearAllErrors] = useFormErrors({});
    const [formStatus, setFormStatus, clearFormStatus] = useFormStatus();
    const { loading, executeRequest } = useApiError();

    const handleChange = (e) => {
        setCode(e.target.value);
        clearError('code');
    }

    const handleSubmit = async () => {
        clearAllErrors();
        clearFormStatus();

        if (!code) {
            setError('code', 'El código es obligatorio');
            return;
        }

        // Ejecutar la solicitud de validación
        const response = await executeRequest(
            async () => await sendCode(code),
            {
                loadingMessage: 'Validando código...',
                errorMessage: 'Ha ocurrido un error al validar el código. Inténtalo de nuevo.'
            }
        );

        if (response && response.account) {
            setFormStatus(response.account, ErrorTypes.ERROR);
        } else if (response && response.code) {
            setError('code', response.code);
        }

        // Si la validación es exitosa, sendCode manejará la redirección
    }

    return (
        <div className={styles.layout.flexCenter}>
            <div className={styles.container.form}>
                <h1 className={styles.headings.h1}>Validar correo</h1>
                <p className={styles.headings.paragraph}>Introduce el código de 6 dígitos que te hemos enviado al correo</p>

                <FormStatusMessage
                    status={formStatus}
                    onDismiss={clearFormStatus}
                />

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <input
                        type="text"
                        value={code}
                        onChange={handleChange}
                        className={`${styles.form.input.base} ${errors.code ? styles.form.input.error : styles.form.input.valid} mb-4`}
                        disabled={loading}
                    />
                    <FormFieldError error={errors.code} />

                    <button
                        type="submit"
                        className={styles.buttons.primary}
                        disabled={loading}
                    >
                        {loading ? 'Validando...' : 'Validar'}
                    </button>
                </form>
            </div>
        </div>
    );
}