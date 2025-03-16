// Componente: Dashboard
// Devuelve una página global de la aplicación con un menú de navegación y un contenido principal.
// Debe de mostrar un mensaje de error si no se puede cargar el contenido principal.
// Debe de mostrar un spinner de carga mientras se carga el contenido principal.
'use client';
import { useEffect, useState } from "react";
import GetTFGs from "./components/lib/GetTFGs";
import TFGcard from "./components/TFGcard";
import SearchBar from "./components/SearchBar";
import PostTenTFGs from "./components/lib/PostTenTFGs";
import { get } from "http";
export default function Dashboard() {
    const [tfgs, setTfgs] = useState(null);
    const [searchResults, setSearchResults] = useState(false);
    const [search, setSearch] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        getSearchResult(1, {});
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
        setSearch(search);
        setSearchResults(true);
        setTfgs(null);
        getSearchResult(1, search);
    }


    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getSearchResult(nextPage, search);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const previousPage = currentPage - 1;
            setCurrentPage(previousPage);
            getSearchResult(previousPage, search);
        }
    };

    return (
        <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%]">
            <SearchBar search={setTfgsResults} />
            {!searchResults ? <h1 className="text-4xl font-bold mb-4">Proyectos Destacados</h1> : <h1 className="text-4xl font-bold mb-4">Resultados de la búsqueda</h1>}
            {tfgs ? (
                <div className="flex-col gap-4">
                    {tfgs.map((tfg, index) => (
                        <TFGcard key={index} tfg={tfg} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )}
            <div className="flex justify-between mt-4">
                <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 rounded-md">Previous</button>
                <button onClick={handleNextPage} className="px-4 py-2 bg-gray-300 rounded-md">Next</button>
            </div>
        </div>
    );
}