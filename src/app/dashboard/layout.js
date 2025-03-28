// Página principal del dashboard de la aplicación.
// Muestra una lista de proyectos destacados (TFGs) y permite realizar búsquedas personalizadas.
// Incluye un spinner de carga mientras se obtienen los datos del servidor.

'use client'; // Indica que este archivo se ejecuta en el cliente.
import { useEffect, useState } from "react";
import TFGcard from "./components/TFGcard"; // Componente para mostrar información de un TFG.
import SearchBar from "./components/SearchBar"; // Barra de búsqueda para filtrar proyectos.
import PostTenTFGs from "./components/lib/PostTenTFGs"; // Función para obtener los TFGs destacados desde el servidor.
import LoadingSpinner from "./components/LoadingSpinner"; // Componente para mostrar un spinner de carga.

// Componente principal del dashboard
/**
 * Dashboard es el componente principal que gestiona la visualización de los proyectos destacados.
 * 
 * @returns {JSX.Element} - Devuelve la interfaz del dashboard con los proyectos destacados y la barra de búsqueda.
 */
export default function Dashboard() {
    // Estado para almacenar los TFGs obtenidos del servidor
    const [tfgs, setTfgs] = useState(null);

    // Estado para almacenar el número total de páginas de resultados
    const [pages, setPages] = useState(1);

    // Estado para controlar si los datos están cargando
    const [loading, setLoading] = useState(true);

    // useEffect para cargar los TFGs destacados al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PostTenTFGs(1, {}); // Llama a la función para obtener los TFGs
                setTfgs(response.tfgs); // Almacena los TFGs en el estado
                setPages(response.totalPages); // Almacena el número total de páginas
            } catch (error) {
                console.error("Error al cargar los TFGs:", error); // Manejo de errores
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchData(); // Ejecuta la función para obtener los datos
    }, []);

    // Función para manejar los resultados de búsqueda
    /**
     * setTfgsResults redirige a la página de resultados de búsqueda con los parámetros correspondientes.
     * 
     * @param {Object} search - Los criterios de búsqueda introducidos por el usuario.
     */
    const setTfgsResults = (search) => {
        // Convierte los criterios de búsqueda en una cadena codificada para la URL
        const searchQuery = encodeURIComponent(JSON.stringify(search));
        window.location.href = `/dashboard/search?search=${searchQuery}`; // Redirige a la página de búsqueda
    };

    // Renderizado del componente
    return (
        <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
            {/* Barra de búsqueda */}
            <SearchBar search={setTfgsResults} />

            {/* Título del dashboard */}
            <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Proyectos Destacados</h1>

            {/* Contenido principal: spinner de carga, lista de TFGs o mensaje de error */}
            {loading ? (
                // Muestra un spinner mientras los datos están cargando
                <LoadingSpinner message="Cargando proyectos destacados..." />
            ) : tfgs && tfgs.length > 0 ? (
                // Muestra los TFGs si hay datos disponibles
                <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
                    {tfgs.map((tfg, index) => (
                        <TFGcard key={index} tfg={tfg} className="w-full md:w-[48%] lg:w-[32%]" />
                    ))}
                </div>
            ) : (
                // Muestra un mensaje si no se encontraron proyectos
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No se encontraron proyectos destacados.</p>
                </div>
            )}
        </div>
    );
}