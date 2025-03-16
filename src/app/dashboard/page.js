'use client';
import { useEffect, useState } from "react";
import TFGcard from "./components/TFGcard";
import SearchBar from "./components/SearchBar";
import PostTenTFGs from "./components/lib/PostTenTFGs";
export default function Dashboard() {
    const [tfgs, setTfgs] = useState(null);
    useEffect(() => {
        PostTenTFGs(1, {}).then((response) => {
            setTfgs(response);
        });
    }, []);
    const setTfgsResults = (search) => {
        // Redirigir a la página de resultados y pasar la búsqueda a través de parámetros de la URL
        const searchQuery = encodeURIComponent(JSON.stringify(search));
        window.location.href = `/dashboard/search?search=${searchQuery}`; // Redirige a la página con la búsqueda
    };

    return (
        <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%]">
            <SearchBar search={setTfgsResults} />
            <h1 className="text-4xl font-bold mb-4">Proyectos Destacados</h1>
            {tfgs ? (
                <div className="flex-col gap-4">
                    {tfgs.map((tfg, index) => (
                        <TFGcard key={index} tfg={tfg} />
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}