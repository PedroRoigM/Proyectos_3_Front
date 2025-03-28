// Este archivo define la página de validación de la aplicación.
// Contiene una función principal que renderiza el componente Validation
// y una función interna para manejar el envío de datos al servidor.

'use server'; // Indica que este archivo contiene código que se ejecuta en el servidor.
import PatchValidation from "../components/lib/validate"; // Función para validar datos en el servidor.
import Validation from "../components/Validation"; // Componente de validación que se renderiza en la página.

// Función principal de la página
/**
 * Page es la función principal que renderiza la página de validación.
 * 
 * @returns {JSX.Element} - Devuelve el componente Validation con la lógica de envío de datos.
 */
export default async function Page() {

    // Función para manejar el envío de datos
    /**
     * handleSubmit maneja el envío de un código al servidor para validación.
     * 
     * @param {string} code - El código que se enviará para validación.
     * @returns {null|any} - Devuelve null si hay un error, o el resultado de la validación si es exitoso.
     */
    async function handleSubmit(code) {
        "use server"; // Indica que esta función se ejecuta en el servidor.
        const result = await PatchValidation(code); // Llama a la función de validación con el código proporcionado.
        if (!result) {
            return null; // Si hay un error, se devuelve null.
        }
    };

    // Renderiza el componente Validation y pasa la función handleSubmit como prop
    return <Validation sendCode={handleSubmit} />;
}