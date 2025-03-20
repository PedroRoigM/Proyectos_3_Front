// Componente: Login
// Devuelve un formulario de login con los campos de email y contraseña.
// Debe de mostrar un mensaje de error si el email no es válido.
// Debe de mostrar un mensaje de error si algún campo está vacío.
// Debe de mostrar un mensaje de éxito si el login se ha realizado correctamente.
// Debe de mostrar un spinner de carga mientras se realiza el login.

"use client";

import { useState } from 'react';
import PostRegister from './lib/register';



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
            if (formData.password.length < 6) {
                setErrors({ password: 'La contraseña debe tener al menos 6 caracteres.' });
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
        <div className="flex items-center justify-center ">
            <div className="bg-white mt-[10%] p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-gray-800 font-bold text-2xl mb-4">Registro</h1>

                {loading && <p className="text-gray-500">Cargando...</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="text-gray-700 block mb-1">Usuario</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="text-left">
                        <label className="text-gray-700 block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="text-left">
                        <label className="text-gray-700 block mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md mt-2">
                        Registrarse
                    </button>

                    <p onClick={changeToLogin} className="cursor-pointer text-blue-600 text-sm">¿Ya tiene cuenta?</p>
                </form>
            </div>
        </div>
    );
}
