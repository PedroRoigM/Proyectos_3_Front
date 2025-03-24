'use client';
import { useState, useEffect } from "react";
import GetDegrees from "./lib/GetDegrees";
import GetAdvisors from "./lib/GetAdvisors";
import GetYears from "./lib/GetYears";

export default function SearchBar({ search }) {
    const [formDataSearch, setFormDataSearch] = useState({
        year: "",
        degree: "",
        advisor: "",
        search: ""
    });

    // Inicializar con arrays vacíos en lugar de arrays con objetos vacíos
    const [degrees, setDegrees] = useState([]);
    const [years, setYears] = useState([]);
    const [advisors, setAdvisors] = useState([]);

    useEffect(() => {
        // Añadir manejo de errores y usar Promise.all para cargar en paralelo
        Promise.all([
            GetDegrees().catch(() => []),
            GetYears().catch(() => []),
            GetAdvisors().catch(() => [])

        ]).then(([degreesData, yearsData, advisorsData]) => {
            // Añadir opción por defecto solo si hay datos
            setDegrees(degreesData.length > 0 ? [{ degree: "Grado" }, ...degreesData] : []);
            setYears(yearsData.length > 0 ? [{ year: "Año" }, ...yearsData] : []);
            setAdvisors(advisorsData.length > 0 ? [{ advisor: "Tutor" }, ...advisorsData] : []);
        });

    }, []);

    const handleChange = (e) => {
        setFormDataSearch({
            ...formDataSearch,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        search(formDataSearch);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-black">
            {/* Input de búsqueda */}
            <input
                type="text"
                name="search"
                value={formDataSearch.search}
                onChange={handleChange}
                placeholder="Buscar..."
                className="border border-gray-400 rounded-md px-2 py-1 w-full text-sm"
            />

            {/* Contenedor más compacto */}
            <div className="flex flex-wrap gap-2">
                {/* Select Año */}
                <select
                    name="year"
                    value={formDataSearch.year}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full sm:w-auto flex-1"
                >
                    {(years || []).map((year, index) => (
                        <option
                            key={year?.year || `year-${index}`}
                            value={year?.year || ""}
                        >
                            {year?.year || "Año"}
                        </option>
                    ))}
                </select>

                {/* Select Grado */}
                <select
                    name="degree"
                    value={formDataSearch.degree}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full sm:w-auto flex-1"
                >
                    {(degrees || []).map((degree, index) => (
                        <option
                            key={degree?._id || `degree-${index}`}
                            value={degree?.degree || ""}
                        >
                            {degree?.degree || "Grado"}
                        </option>
                    ))}
                </select>

                {/* Select Tutor */}
                <select
                    name="advisor"
                    value={formDataSearch.advisor}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full sm:w-auto flex-1"
                >
                    {(advisors || []).map((advisor, index) => (
                        <option
                            key={advisor?._id || `advisor-${index}`}
                            value={advisor?.advisor || ""}
                        >
                            {advisor?.advisor || "Tutor"}
                        </option>
                    ))}
                </select>

                {/* Botón de búsqueda */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-bold rounded-md px-3 py-1 text-sm w-full sm:w-auto flex-1 hover:bg-blue-600 transition"
                >
                    Buscar
                </button>
            </div>
        </form>
    )
}