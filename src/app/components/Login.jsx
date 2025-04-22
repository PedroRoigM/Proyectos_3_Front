"use client";

import { useState } from 'react';
import PostLogin from './lib/login';
import { styles, inputClassName } from './styles/components';
import { validateLoginForm } from './errors/FormValidation';
import { ErrorHandler, ErrorTypes } from './errors/ErrorHandler';

export default function Login({ changeToRegister }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formStatus, setFormStatus] = useState({
        message: '',
        type: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear field-specific error when field changes
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const clearFormStatus = () => {
        setFormStatus({ message: '', type: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setFormStatus({ message: '', type: '' });

        // Validate form fields
        const validationErrors = validateLoginForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await PostLogin(formData);

            if (response && response.account) {
                // Server returned an error
                setFormStatus({
                    message: response.account,
                    type: ErrorTypes.ERROR
                });
                setErrors(response);
            } else if (!response) {
                // Generic error
                setFormStatus({
                    message: "Ha ocurrido un error. Inténtalo de nuevo.",
                    type: ErrorTypes.ERROR
                });
            }
            // If successful, PostLogin will redirect to dashboard
        } catch (err) {
            console.error("Login error:", err);
            setFormStatus({
                message: "Ha ocurrido un error. Inténtalo de nuevo.",
                type: ErrorTypes.ERROR
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.layout.flexCenter}>
            <div className={styles.container.form}>
                <h1 className={styles.headings.h1}>Login</h1>

                {formStatus.message && (
                    <ErrorHandler
                        message={formStatus.message}
                        type={formStatus.type}
                        dismissible={true}
                        onDismiss={clearFormStatus}
                    />
                )}

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
                        {errors.email && <p className={styles.errors.text}>{errors.email}</p>}
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
                        {errors.password && <p className={styles.errors.text}>{errors.password}</p>}
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

                    <p onClick={changeToRegister} className={styles.buttons.link}>
                        ¿No tiene cuenta?
                    </p>
                </form>
            </div>
        </div>
    );
}