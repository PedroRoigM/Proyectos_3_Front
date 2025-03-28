// Este componente es una página de resultados de búsqueda dentro del sistema de gestión de TFGs.
// Permite a los usuarios buscar proyectos de TFG mediante un formulario de búsqueda y muestra los resultados en forma de tarjetas.
// Incluye paginación para navegar entre los resultados y manejo de errores en caso de que no se encuentren resultados.
// Los datos se obtienen de una API mediante funciones asincrónicas.

'use client'; // Indica que este componente se ejecuta en el cliente (Next.js).

import TFGcard from '../components/TFGcard'; // Componente para mostrar la información de un TFG en forma de tarjeta.
import PostTenTFGs from '../components/lib/PostTenTFGs'; // Función para obtener los TFGs desde el backend.
import { useEffect, useState } from "react";
import SearchBar from '../components/SearchBar'; // Componente para realizar la búsqueda.
import LoadingSpinner from '../components/LoadingSpinner'; // Componente para mostrar un spinner de carga.

export default function SearchResults() {
    // Estados para manejar los datos y la interfaz.
    const [tfgs, setTfgs] = useState(null); // Lista de TFGs obtenidos de la búsqueda.
    const [search, setSearch] = useState({}); // Parámetros de búsqueda.
    const [currentPage, setCurrentPage] = useState(1); // Página actual de los resultados.
    const [pages, setPages] = useState(1); // Número total de páginas disponibles.
    const [loading, setLoading] = useState(true); // Estado de carga mientras se obtienen los datos.
    const [noResults, setNoResults] = useState(false); // Estado para indicar si no hay resultados.

    // useEffect para cargar los resultados de búsqueda al montar el componente o cambiar los parámetros de búsqueda.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search); // Obtiene los parámetros de la URL.
                const searchQuery = searchParams.get('search'); // Obtiene el parámetro de búsqueda.
                const page_number = parseInt(searchParams.get('page_number')) || 1; // Obtiene el número de página o usa 1 por defecto.

                if (searchQuery) {
                    // Decodifica y parsea el parámetro de búsqueda.
                    const parsedSearch = JSON.parse(decodeURIComponent(searchQuery));
                    setSearch(parsedSearch); // Actualiza el estado con los parámetros de búsqueda.
                    setCurrentPage(page_number); // Actualiza la página actual.
                    await getSearchResult(page_number, parsedSearch); // Obtiene los resultados de búsqueda.
                }
            } catch (error) {
                console.error("Error al procesar la búsqueda:", error);
                setLoading(false);
                setNoResults(true); // Muestra un mensaje de "sin resultados" en caso de error.
            }
        };

        fetchData();
    }, []);

    // Función para obtener los resultados de búsqueda desde el backend.
    const getSearchResult = (page_number, dataForm) => {
        // Filtra los datos del formulario para eliminar campos vacíos.
        const sanitizedFormData = Object.fromEntries(
            Object.entries(dataForm).filter(([key, value]) => value !== "")
        );
        PostTenTFGs(page_number, sanitizedFormData).then((response) => {
            setTfgs(response.tfgs); // Actualiza el estado con los TFGs obtenidos.
            setPages(response.totalPages); // Actualiza el número total de páginas.
            setLoading(false); // Detiene el estado de carga.
        });
    };

    // Función para redirigir a la página de resultados con los parámetros de búsqueda.
    const setTfgsResults = (search) => {
        const searchQuery = encodeURIComponent(JSON.stringify(search)); // Codifica los parámetros de búsqueda.
        window.location.href = `/dashboard/search?search=${searchQuery}`; // Redirige a la página con los parámetros.
    };

    // Función para cambiar de página en los resultados.
    const changePage = (page_number) => {
        const searchQuery = encodeURIComponent(JSON.stringify(search)); // Codifica los parámetros de búsqueda.
        window.location.href = `/dashboard/search?page_number=${page_number}&search=${searchQuery}`; // Redirige a la página con el número de página actualizado.
    };

    // Renderizado del componente.
    return (
        <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
            {/* Barra de búsqueda */}
            <SearchBar search={setTfgsResults} />
            <h1 className="text-4xl font-bold mb-4">Resultados de la búsqueda</h1>

            {/* Muestra un spinner mientras se cargan los resultados */}
            {loading ? (
                <LoadingSpinner message="Buscando proyectos..." />
            ) : noResults ? (
                // Muestra un mensaje si no hay resultados.
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No se encontraron resultados para esta búsqueda.</p>
                </div>
            ) : (
                <>
                    {/* Lista de resultados */}
                    <div className="flex flex-col gap-4">
                        {tfgs.map((tfg, index) => (
                            <TFGcard key={index} tfg={tfg} /> // Renderiza cada TFG como una tarjeta.
                        ))}
                    </div>

                    {/* Botones para la paginación */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => changePage(currentPage - 1)} // Cambia a la página anterior.
                            disabled={currentPage === 1} // Desactiva el botón si está en la primera página.
                            className={`px-4 py-2 rounded-md transition ${currentPage === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        >
                            Anterior
                        </button>

                        {/* Indicador de la página actual */}
                        <span className="flex items-center px-4">
                            Página {currentPage} de {pages}
                        </span>

                        <button
                            onClick={() => changePage(currentPage + 1)} // Cambia a la página siguiente.
                            disabled={currentPage >= pages} // Desactiva el botón si está en la última página.
                            className={`px-4 py-2 rounded-md transition ${currentPage >= pages
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}