"use client";

import { useState } from 'react';
import PostRegister from './lib/register';
import { styles, classNames } from './styles/components';

export default function Register({ changeToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors({ ...errors, [name]: null });
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const newErrors = {};
            if (!formData.name) newErrors.name = 'El nombre es obligatorio.';
            if (!formData.email) newErrors.email = 'El email es obligatorio.';
            if (!formData.password) newErrors.password = 'La contraseña es obligatoria.';
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                setErrors({ email: 'El email no es válido.' });
                setLoading(false);
                return;
            }
            // Que cumpla con el formato nombre.apellido@u-tad.com o nombre.apellidoN@live.u-tad.com
            if (!/^[a-zA-Z]+\.[a-zA-Z]+\d?@(u-tad\.com|live\.u-tad\.com)$/.test(formData.email)) {
                setErrors({ email: 'El email debe tener el formato nombre.apellido@u-tad.com o nombre.apellidoN@live.u-tad.com.' });
                setLoading(false);
                return;
            }

            // Contraseña de más de 6 caracteres y tiene que contener al menos una mayuscula, una minuscula y un número
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(formData.password)) {
                setErrors({ password: 'La contraseña no es válida.' });
                setLoading(false);
                return;
            }

            const response = await PostRegister(formData);
            if (response === null) {
                setErrors({ email: 'El email ya está en uso.' });
                setLoading(false);
                return;
            }

        } catch (err) {
            setErrors({ email: 'Ha ocurrido un error.' });
            setLoading(false);
            return;
        }
    };

    return (
        <div className={styles.layout.flexCenter}>
            <div className={styles.container.form}>
                <h1 className={styles.headings.h1}>Registro</h1>

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
                        />
                        {errors.password && <p className={styles.form.error}>{errors.password}</p>}
                    </div>

                    <button type="submit" className={styles.buttons.primary}>
                        Registrarse
                    </button>

                    <p onClick={changeToLogin} className={styles.buttons.link}>¿Ya tiene cuenta?</p>
                </form>
            </div>
        </div>
    );
}