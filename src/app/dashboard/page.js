'use client';
import { useEffect, useState } from "react";
import TFGcard from "./components/TFGcard";
import SearchBar from "./components/SearchBar";
import PostTenTFGs from "./components/lib/PostTenTFGs";
import LoadingSpinner from "./components/LoadingSpinner";
export default function Dashboard() {
    const [tfgs, setTfgs] = useState(null);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PostTenTFGs(1, {});
                setTfgs(response.tfgs);
                setPages(response.totalPages);
            } catch (error) {
                console.error("Error al cargar los TFGs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const setTfgsResults = (search) => {
        // Redirigir a la página de resultados y pasar la búsqueda a través de parámetros de la URL
        const searchQuery = encodeURIComponent(JSON.stringify(search));
        window.location.href = `/dashboard/search?search=${searchQuery}`; // Redirige a la página con la búsqueda
    };
    return (
        <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
            <SearchBar search={setTfgsResults} />
            <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Proyectos Destacados</h1>

            {loading ? (
                <LoadingSpinner message="Cargando proyectos destacados..." />
            ) : tfgs && tfgs.length > 0 ? (
                <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
                    {tfgs.map((tfg, index) => (
                        <TFGcard key={index} tfg={tfg} className="w-full md:w-[48%] lg:w-[32%]" />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No se encontraron proyectos destacados.</p>
                </div>
            )}
        </div>
    );
}