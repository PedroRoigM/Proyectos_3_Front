// Componente: Home
// Devuelve la página principal de la aplicación.
// Debe de mostrar un mensaje de bienvenida.
// Debe de mostrar un botón de registro.
// Debe de mostrar un botón de login.
// Tras el registro, debe redirigir a la página de validacion.
// Tras la validación, debe redirigir a la página de login.
// Tras el login, debe redirigir a la página de dashboard.
'use client';
import Login from './components/Login';
import Register from './components/Register';
import { useState, useEffect } from 'react';
export default function Home() {
  const [login, setLogin] = useState(false);
  const handleChange = () => {
    setLogin(!login)
  }
  return (
    <div className="font-montserrat rounded-md from-white to-gray-400 bg-gradient-to-b h-screen">
      {login ? <Login changeToRegister={handleChange} /> : <Register changeToLogin={handleChange} />}
    </div>
  );
}