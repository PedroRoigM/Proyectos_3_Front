// Componente: Register
// Este componente renderiza un formulario de registro para nuevos usuarios.
// Incluye validaciones para los campos de nombre, email y contraseña.
// Muestra mensajes de error si los datos ingresados no cumplen con los requisitos.
// Muestra un spinner de carga mientras se procesa el registro.
// Redirige a la página de validación tras un registro exitoso.

"use client"; // Indica que este componente se ejecuta en el cliente.

import { useState } from 'react';
import PostRegister from './lib/register'; // Importa la función para realizar la solicitud de registro al servidor.

export default function Register({ changeToLogin }) {
    // Estado para almacenar los datos del formulario.
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // Estado para almacenar los errores de validación.
    const [errors, setErrors] = useState({});

    // Estado para controlar el estado de carga.
    const [loading, setLoading] = useState(false);

    // Maneja los cambios en los campos del formulario.
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Limpia los errores del campo actual al modificarlo.
        setErrors({ ...errors, [name]: null });
        // Actualiza el estado con los nuevos valores del formulario.
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Maneja el envío del formulario.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario.
        setLoading(true); // Activa el estado de carga.
        setErrors({}); // Limpia los errores previos.

        try {
            const newErrors = {};
            // Validación de campos vacíos.
            if (!formData.name) newErrors.name = 'El nombre es obligatorio.';
            if (!formData.email) newErrors.email = 'El email es obligatorio.';
            if (!formData.password) newErrors.password = 'La contraseña es obligatoria.';
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors); // Muestra los errores si hay campos vacíos.
                setLoading(false); // Desactiva el estado de carga.
                return;
            }

            // Validación de formato de email.
            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                setErrors({ email: 'El email no es válido.' });
                setLoading(false);
                return;
            }

            // Validación de dominio específico para el email.
            if (!/^[a-zA-Z]+\.[a-zA-Z]+\d?@(u-tad\.com|live\.u-tad\.com)$/.test(formData.email)) {
                setErrors({ email: 'El email debe tener el formato nombre.apellido@u-tad.com o nombre.apellidoN@live.u-tad.com.' });
                setLoading(false);
                return;
            }

            // Validación de contraseña (mínimo 7 caracteres, al menos una mayúscula, una minúscula y un número).
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/.test(formData.password)) {
                setErrors({ password: 'La contraseña no es válida.' });
                setLoading(false);
                return;
            }

            // Llama a la función para registrar al usuario.
            const response = await PostRegister(formData);
            if (response === null) {
                setErrors({ email: 'El email ya está en uso.' });
                setLoading(false);
                return;
            }

        } catch (err) {
            // Manejo de errores generales.
            setErrors({ email: 'Ha ocurrido un error.' });
            setLoading(false);
            return;
        }
    };

    return (
        <div className="flex items-center justify-center ">
            <div className="bg-white mt-[10%] p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-gray-800 font-bold text-2xl mb-4">Registro</h1>

                {/* Muestra un mensaje de carga si el estado loading está activo. */}
                {loading && <p className="text-gray-500">Cargando...</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo de entrada para el nombre del usuario. */}
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
                        {/* Muestra un mensaje de error si el campo tiene errores. */}
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Campo de entrada para el email del usuario. */}
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

                    {/* Campo de entrada para la contraseña del usuario. */}
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

                    {/* Botón para enviar el formulario. */}
                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md mt-2">
                        Registrarse
                    </button>

                    {/* Enlace para cambiar al formulario de login. */}
                    <p onClick={changeToLogin} className="cursor-pointer text-blue-600 text-sm">¿Ya tiene cuenta?</p>
                </form>
            </div>
        </div>
    );
}