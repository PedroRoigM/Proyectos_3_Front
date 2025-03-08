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
  const getTFGS = async () => {
    const tfgs = await GetTFGs();
    console.log(tfgs);
  }
  const getTFG = async (id) => {
    const tfg = await GetTFG({ id: id });
    console.log(tfg);
  }
  const postTFG = async () => {
    const formData = {
      "year": "22/23",
      "degree": "Grado en Diseño de Productos Interactivos (DIPI)",
      "student": "Paquito",
      "tfgTitle": "ANÁLISIS DE BUENAS PRÁCTICAS EN EL DISEÑO DE INTERFACES PARA JUEGOS DE REALIDAD VIRTUAL",
      "keywords": ["Realidad Virtual", "Experiencia de Usuario", "Interfaz de Usuario", "Inmersión"],
      "advisor": "Álvaro Ortuño Morente",
      "abstract": "prueba"
    };
    const tfg = await PostTFG({ formData: formData });
    console.log(tfg);
  }
  //postTFG();
  getTFG("67cc7e501aa308fc5563ed4f");
  return (
    <div>

    </div>
  );
}
