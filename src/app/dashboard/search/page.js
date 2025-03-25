'use client';

import TFGcard from '../components/TFGcard';
import PostTenTFGs from '../components/lib/PostTenTFGs';
import { useEffect, useState } from "react";
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
export default function SearchResults() {
    const [tfgs, setTfgs] = useState(null);
    const [search, setSearch] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const searchQuery = searchParams.get('search');
                const page_number = parseInt(searchParams.get('page_number')) || 1;

                if (searchQuery) {
                    // Decodificar y parsear el searchQuery
                    const parsedSearch = JSON.parse(decodeURIComponent(searchQuery));
                    setSearch(parsedSearch);  // Actualiza el estado con la búsqueda
                    setCurrentPage(page_number);
                    await getSearchResult(page_number, parsedSearch);
                } else {
                    setLoading(false);
                    setNoResults(true);
                }
            } catch (error) {
                console.error("Error al procesar la búsqueda:", error);
                setLoading(false);
                setNoResults(true);
            }
        };

        fetchData();
    }, []);

    const getSearchResult = (page_number, dataForm) => {
        const sanitizedFormData = Object.fromEntries(
            Object.entries(dataForm).filter(([key, value]) => value !== "")
        );
        PostTenTFGs(page_number, sanitizedFormData).then((response) => {
            setTfgs(response.tfgs);
            setPages(response.totalPages);
        });
    };
    const setTfgsResults = (search) => {
        // Redirigir a la página de resultados y pasar la búsqueda a través de parámetros de la URL
        const searchQuery = encodeURIComponent(JSON.stringify(search));
        window.location.href = `/dashboard/search?search=${searchQuery}`; // Redirige a la página con la búsqueda
    };
    const changePage = (page_number) => {
        const searchQuery = encodeURIComponent(JSON.stringify(search));
        window.location.href = `/dashboard/search?page_number=${page_number}&search=${searchQuery}`; // Redirige a la página con la búsqueda
    };
    return (
        <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
            <SearchBar search={setTfgsResults} />
            <h1 className="text-4xl font-bold mb-4">Resultados de la búsqueda</h1>

            {loading ? (
                <LoadingSpinner message="Buscando proyectos..." />
            ) : noResults ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No se encontraron resultados para esta búsqueda.</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {tfgs.map((tfg, index) => (
                            <TFGcard key={index} tfg={tfg} />
                        ))}
                    </div>

                    {/* Botones para paginación */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md transition ${currentPage === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        >
                            Anterior
                        </button>

                        <span className="flex items-center px-4">
                            Página {currentPage} de {pages}
                        </span>

                        <button
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage >= pages}
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