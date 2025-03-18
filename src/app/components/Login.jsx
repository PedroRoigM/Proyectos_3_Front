// Componente: Login
// Devuelve un formulario de login con los campos de email y contraseña.
// Debe de mostrar un mensaje de error si el email no es válido.
// Debe de mostrar un mensaje de error si algún campo está vacío.
// Debe de mostrar un mensaje de éxito si el login se ha realizado correctamente.
// Debe de mostrar un spinner de carga mientras se realiza el login.

"use client";

import { useState } from 'react';
import PostLogin from './lib/login';
export default function Login({ changeToRegister }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        try {
            if (!formData.email || !formData.password) {
                setError('Todos los campos son obligatorios.');
                setLoading(false);
                return;
            }

            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                setError('El email no es válido.');
                setLoading(false);
                return;
            }

            const response = await PostLogin(formData);
            if (response.error) {
                setError(response.error);
                setLoading(false);
                return;
            }
            setSuccess('Login realizado correctamente.');
            // Redirigir a la página de dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div className="flex items-center justify-center h-screen p-5 bg-gradient-to-b from-white to-gray-400">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-gray-800 font-bold text-2xl mb-4">Login</h1>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {success && <p className="text-green-500 mb-2">{success}</p>}
                {loading && <p className="text-gray-500">Cargando...</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="text-gray-700 block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none"
                        />
                    </div>
                    <div className="text-left">
                        <label className="text-gray-700 block mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none"
                        />
                    </div>
                    <a href="/recover-password" className="text-blue-600 text-sm block text-left">¿Has olvidado tu contraseña?</a>
                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md mt-2">
                        Iniciar sesión
                    </button>

                    {/* Botón Registro 
                    <button onClick={changeToRegister} className="w-full bg-gray-700 text-white font-bold py-2 rounded-md mt-2">
                        Registrarse
                    </button>
                    */}

                    <p onClick={changeToRegister} className="cursor-pointer text-blue-600 text-sm block text-left">¿No tiene cuenta?</p>
                </form>
            </div>
        </div>
    );
}
