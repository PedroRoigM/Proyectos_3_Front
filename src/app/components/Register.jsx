"use client";

import { useState } from 'react';
import PostRegister from './lib/register';
import { styles, classNames } from './styles/components';
import { validateLoginForm } from './errors/FormValidation';
import { ErrorHandler, ErrorTypes } from './errors/ErrorHandler';

export default function Register({ changeToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
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

        // Clear field-specific error when field changes
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const clearFormStatus = () => {
        setFormStatus({ message: '', type: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setFormStatus({ message: '', type: '' });

        try {
            // Validate form data
            const validationErrors = validateRegisterForm(formData);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setLoading(false);
                return;
            }

            const response = await PostRegister(formData);

            // Handle different response scenarios
            if (response && response.email) {
                // Email-specific error
                setFormStatus({
                    message: response.email,
                    type: ErrorTypes.ERROR
                });
            } else if (response === null) {
                // General error
                setFormStatus({
                    message: "Ha ocurrido un error al registrar tu cuenta. Inténtalo de nuevo.",
                    type: ErrorTypes.ERROR
                });
            }
            // If successful, PostRegister will redirect to validation page

        } catch (err) {
            console.error("Registration error:", err);
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
                <h1 className={styles.headings.h1}>Registro</h1>

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
                        {errors.name && <p className={styles.form.error}>{errors.name}</p>}
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
                        {errors.email && <p className={styles.form.error}>{errors.email}</p>}
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
                        {errors.password && <p className={styles.form.error}>{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className={styles.buttons.primary}
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <p onClick={changeToLogin} className={styles.buttons.link}>¿Ya tiene cuenta?</p>
                </form>
            </div>
        </div>
    );
}