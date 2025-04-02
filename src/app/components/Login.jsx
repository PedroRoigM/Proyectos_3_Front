"use client";

import { useState } from 'react';
import PostLogin from './lib/login';

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
            if (!response) {
                setErrors({ global: 'El email o la contraseña son incorrectos.' });
                setLoading(false);
                return;
            }

            // Redirigir a la página de dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setErrors({ global: 'Ha ocurrido un error. Inténtalo de nuevo.' });
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white mt-[10%] p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-gray-800 font-bold text-2xl mb-4">Login</h1>

                {loading && <p className="text-gray-500">Cargando...</p>}
                {errors.global && <p className="text-red-500">{errors.global}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="text-gray-700 block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="text-left">
                        <label className="text-gray-700 block mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <a href="/recover-password" className="text-blue-600 text-sm block text-left">
                        ¿Has olvidado tu contraseña?
                    </a>

                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md mt-2">
                        Iniciar sesión
                    </button>

                    <p onClick={changeToRegister} className="cursor-pointer text-blue-600 text-sm">
                        ¿No tiene cuenta?
                    </p>
                </form>
            </div>
        </div>
    );
}