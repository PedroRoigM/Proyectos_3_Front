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
import GetTFGs from "./dashboard/components/lib/GetTFGs";
import GetTFG from "./dashboard/components/lib/GetTFG";
import PostTFG from "./dashboard/components/lib/PostTFG";
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
      <Link href="/dashboard/TFGs_Pruebas">
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
          }}>
          TFG page
        </button>
      </Link>
    </div >
  );
}