'use client';

import TFGcardUnverified from '../components/TFGcardUnverified';
import GetUnverifiedTFGs from '../../components/lib/GetUnverifiedTFGs';
import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar';
import { styles } from '../components/styles/components';
import LoadingSpinner from '../../components/LoadingSpinner';
export default function SearchResults() {
    const [tfgs, setTfgs] = useState(null);
    const [search, setSearch] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const searchQuery = searchParams.get('search');
        const page_number = parseInt(searchParams.get('page_number')) || 1;

        if (searchQuery) {
            // Decodificar y parsear el searchQuery
            const parsedSearch = JSON.parse(decodeURIComponent(searchQuery));
            setSearch(parsedSearch);  // Actualiza el estado con la búsqueda
            setCurrentPage(page_number);
            getSearchResult(page_number, parsedSearch);
        }
        else {
            getSearchResult(page_number, {});
        }
    }, []);
    const getSearchResult = (page_number, dataForm) => {
        const sanitizedFormData = Object.fromEntries(
            Object.entries(dataForm).filter(([key, value]) => value !== "")
        );
        GetUnverifiedTFGs(page_number, sanitizedFormData).then((response) => {
            setTfgs(response.tfgs);
            setPages(response.totalPages);
        });
        setLoading(false);
    };
    const setTfgsResults = (search) => {
        // Redirigir a la página de resultados y pasar la búsqueda a través de parámetros de la URL
        const searchQuery = encodeURIComponent(JSON.stringify(search));
        window.location.href = `/dashboard/search/admin?search=${searchQuery}`; // Redirige a la página con la búsqueda
    };
    const changePage = (page_number) => {
        const searchQuery = encodeURIComponent(JSON.stringify(search));
        window.location.href = `/dashboard/search/admin?page_number=${page_number}&search=${searchQuery}`; // Redirige a la página con la búsqueda
    };

    if (loading) {
        return <LoadingSpinner message="Cargando detalles del proyecto..." />;
    }

    return (
        <div className={styles.search.container}>
            <SearchBar search={setTfgsResults} />
            {loading ?
                <LoadingSpinner message="Cargando detalles del proyecto..." />
                : tfgs && tfgs.length > 0 ? (
                    <div className={styles.search.TFG_result}>
                        {tfgs.map((tfg, index) => (
                            <TFGcardUnverified key={index} tfg={tfg} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">No se encontraron proyectos para revisar.</p>
                    </div>
                )}

            {/* Botones para paginación */}
            <div className={styles.search.button_container}>
                <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.search.button}
                >
                    Anterior
                </button>

                <button
                    onClick={() => changePage(currentPage + 1)}
                    className={styles.search.button}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}