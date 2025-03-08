import Link from 'next/link';
import Image from "next/image";
// Componente: Home
// Devuelve la página principal de la aplicación.
// Debe de mostrar un mensaje de bienvenida.
// Debe de mostrar un botón de registro.
// Debe de mostrar un botón de login.
// Tras el registro, debe redirigir a la página de validacion.
// Tras la validación, debe redirigir a la página de login.
// Tras el login, debe redirigir a la página de dashboard.
export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Link href="/register">
        <button 
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            margin: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em'
          }}
        >
          Register
        </button>
      </Link>
      <Link href="/login">
        <button 
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            margin: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em'
          }}
        >
          Login
        </button>
      </Link>
    </div>
  );
}