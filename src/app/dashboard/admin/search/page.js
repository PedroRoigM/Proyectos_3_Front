'use client';

import TFGcardUnverified from '../components/TFGcardUnverified';
import GetUnverifiedTFGs from '../../components/lib/GetUnverifiedTFGs';
import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar';
import { styles } from '../components/styles/components';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ErrorBoundary } from '../../../components/errors/error-boundary';
import { useNotification } from '../../../components/errors/notification-context';
import { useApiError } from '../../../components/errors/api-error-hook';

function SearchUnverifiedContent() {
    const [tfgs, setTfgs] = useState([]);
    const [search, setSearch] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState(1);
    const { showError } = useNotification();
    const { loading, executeRequest } = useApiError();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const searchQuery = searchParams.get('search');
        const page_number = parseInt(searchParams.get('page_number')) || 1;

        let parsedSearch = {};
        if (searchQuery) {
            try {
                // Decodificar y parsear el searchQuery
                parsedSearch = JSON.parse(decodeURIComponent(searchQuery));
                setSearch(parsedSearch);  // Actualiza el estado con la búsqueda
            } catch (error) {
                console.error("Error al parsear parámetros de búsqueda:", error);
                showError("Error al procesar los parámetros de búsqueda");
                parsedSearch = {}; // Usar búsqueda vacía en caso de error
            }
        }

        setCurrentPage(page_number);
        getSearchResult(page_number, parsedSearch);
    }, [showError]);

    const getSearchResult = async (page_number, dataForm) => {
        try {
            const sanitizedFormData = Object.fromEntries(
                Object.entries(dataForm).filter(([key, value]) => value !== "")
            );

            const response = await executeRequest(
                async () => await GetUnverifiedTFGs(page_number, sanitizedFormData),
                {
                    loadingMessage: 'Buscando TFGs sin verificar...',
                    errorMessage: 'Error al buscar TFGs sin verificar'
                }
            );

            if (response) {
                setTfgs(response.tfgs || []);
                setPages(response.totalPages || 1);
            } else {
                setTfgs([]);
                setPages(1);
                showError("No se pudieron obtener los TFGs pendientes de verificación");
            }
        } catch (error) {
            console.error("Error al obtener TFGs sin verificar:", error);
            showError("Error al cargar los TFGs pendientes de verificación");
            setTfgs([]);
            setPages(1);
        }
    };

    const setTfgsResults = (search) => {
        // Redirigir a la página de resultados y pasar la búsqueda a través de parámetros de la URL
        const searchQuery = encodeURIComponent(JSON.stringify(search));
        window.location.href = `/dashboard/admin/search?search=${searchQuery}`; // Redirige a la página con la búsqueda
    };

    const changePage = (page_number) => {
        const searchQuery = encodeURIComponent(JSON.stringify(search));
        window.location.href = `/dashboard/admin/search?page_number=${page_number}&search=${searchQuery}`; // Redirige a la página con la búsqueda
    };

    // Manejar la eliminación o verificación de un TFG
    const handleTfgChange = (tfgId) => {
        // Actualizar la lista eliminando el TFG modificado
        setTfgs(prevTfgs => prevTfgs.filter(tfg => tfg._id !== tfgId));
    };

    return (
        <div className={styles.search.container}>
            <h1 className="text-2xl font-bold mb-6">TFGs Pendientes de Verificación</h1>

            <SearchBar search={setTfgsResults} />

            {loading ? (
                <LoadingSpinner message="Cargando TFGs por verificar..." />
            ) : tfgs && tfgs.length > 0 ? (
                <div className={styles.search.TFG_result}>
                    {tfgs.map((tfg, index) => (
                        <TFGcardUnverified
                            key={tfg._id || index}
                            tfg={tfg}
                            onStatusChange={handleTfgChange}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No se encontraron proyectos pendientes de verificación.</p>
                </div>
            )}

            {/* Botones para paginación */}
            {!loading && tfgs && tfgs.length > 0 && (
                <div className={styles.search.button_container}>
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className={`${styles.search.button} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Anterior
                    </button>

                    <span className="mx-4 text-gray-700">
                        Página {currentPage} de {pages}
                    </span>

                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage >= pages || loading}
                        className={`${styles.search.button} ${currentPage >= pages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default function SearchResults() {
    return (
        <ErrorBoundary>
            <SearchUnverifiedContent />
        </ErrorBoundary>
    );
}