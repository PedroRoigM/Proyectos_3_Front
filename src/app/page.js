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
  return (
    <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%]">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a la aplicación</h1>
      <div className="flex gap-4">
        <button onClick={() => setLogin(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Registro
        </button>
        <button onClick={() => setLogin(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </button>
      </div>
      {login ? <Login /> : <Register />}
    </div>
  );
}