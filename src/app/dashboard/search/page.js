'use client';

import TFGcard from '../components/TFGcard';
import PostTenTFGs from '../components/lib/PostTenTFGs';
import { useEffect, useState } from "react";
import SearchBar from '../components/SearchBar';
export default function SearchResults() {
    const [tfgs, setTfgs] = useState(null);
    const [search, setSearch] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

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
    }, []);

    const getSearchResult = (page_number, dataForm) => {
        const sanitizedFormData = Object.fromEntries(
            Object.entries(dataForm).filter(([key, value]) => value !== "")
        );
        PostTenTFGs(page_number, sanitizedFormData).then((response) => {
            setTfgs(response);
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
        <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%]">
            <SearchBar search={setTfgsResults} />
            <h1 className="text-4xl font-bold mb-4">Resultados de la búsqueda</h1>
            {tfgs ? (
                <div className="flex-col gap-4">
                    {tfgs.map((tfg, index) => (
                        <TFGcard key={index} tfg={tfg} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )}

            {/* Botones para paginación */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                >
                    Anterior
                </button>

                <button
                    onClick={() => changePage(currentPage + 1)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}