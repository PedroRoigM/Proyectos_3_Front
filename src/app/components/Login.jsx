"use client";

import { useState } from 'react';
import PostLogin from './lib/login';
import { styles, inputClassName } from './styles/components';

export default function Login({ changeToRegister }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Reiniciar errores antes de validar

        let newErrors = {};

        // Validación de email
        if (!formData.email) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido.';
        }

        // Validación de contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        }

        // Si hay errores, los mostramos y detenemos el proceso
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await PostLogin(formData);
            setErrors(response);
            setLoading(false);
        } catch (err) {
            setErrors({ global: 'Ha ocurrido un error. Inténtalo de nuevo.' });
            setLoading(false);
        }
    };

    return (
        <div className={styles.layout.flexCenter}>
            <div className={styles.container.form}>
                <h1 className={styles.headings.h1}>Login</h1>

                {loading && <p className={styles.form.loading}>Cargando...</p>}
                {errors.account && <p className={styles.errors.text}>{errors.account}</p>}

                <form onSubmit={handleSubmit} className={styles.form.container}>
                    <div className={styles.form.group}>
                        <label className={styles.form.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClassName(errors.account)}
                        />
                    </div>

                    <div className={styles.form.group}>
                        <label className={styles.form.label}>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClassName(errors.account)}
                        />
                    </div>

                    <a href="/recover-password" className={styles.buttons.link + " block text-left"}>
                        ¿Has olvidado tu contraseña?
                    </a>

                    <button type="submit" className={styles.buttons.primary}>
                        Iniciar sesión
                    </button>

                    <p onClick={changeToRegister} className={styles.buttons.link}>
                        ¿No tiene cuenta?
                    </p>
                </form>
            </div>
        </div>
    );
}