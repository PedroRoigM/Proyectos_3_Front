'use client';

import TFGcard from '../components/TFGcard';
import PostTenTFGs from '../components/lib/PostTenTFGs';
import { useEffect, useState } from "react";
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchStyles, paginationButtonClass } from '../components/styles/search';

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
            setLoading(false);
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
        <div className={searchStyles.layout.container}>
            <SearchBar search={setTfgsResults} />
            <h1 className={searchStyles.headings.title}>Resultados de la búsqueda</h1>

            {loading ? (
                <LoadingSpinner message="Buscando proyectos..." />
            ) : noResults ? (
                <div className={searchStyles.results.emptyState}>
                    <p className={searchStyles.results.emptyText}>No se encontraron resultados para esta búsqueda.</p>
                </div>
            ) : (
                <>
                    <div className={searchStyles.results.container}>
                        {tfgs.map((tfg, index) => (
                            <TFGcard key={index} tfg={tfg} />
                        ))}
                    </div>

                    {/* Botones para paginación */}
                    <div className={searchStyles.pagination.container}>
                        <button
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={paginationButtonClass(currentPage === 1)}
                        >
                            Anterior
                        </button>

                        <span className={searchStyles.pagination.pageCounter}>
                            Página {currentPage} de {pages}
                        </span>

                        <button
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage >= pages}
                            className={paginationButtonClass(currentPage >= pages)}
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}