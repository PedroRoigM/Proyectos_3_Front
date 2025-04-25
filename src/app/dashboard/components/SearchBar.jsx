'use client';
import { useState, useEffect } from "react";
import GetDegrees from "./lib/GetDegrees";
import GetAdvisors from "./lib/GetAdvisors";
import GetYears from "./lib/GetYears";
import GetTFGsNames from "./lib/GetTFGsNames";

export default function SearchBar({ search }) {
    const [formDataSearch, setFormDataSearch] = useState({
        year: "",
        degree: "",
        advisor: "",
        search: ""
    });

    // Inicializar con arrays vacíos
    const [degrees, setDegrees] = useState([]);
    const [years, setYears] = useState([]);
    const [advisors, setAdvisors] = useState([]);
    const [tfgs, setTfgs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Función para cargar todos los datos
        const loadData = async () => {
            try {
                // Cargar datos en paralelo
                const [degreesData, yearsData, advisorsData, tfgsData] = await Promise.all([
                    GetDegrees().catch(() => []),
                    GetYears().catch(() => []),
                    GetAdvisors().catch(() => []),
                    GetTFGsNames().catch(() => [])
                ]);

                // Verificar y establecer los datos de grados
                if (Array.isArray(degreesData) && degreesData.length > 0) {
                    setDegrees([{ degree: "Grado" }, ...degreesData]);
                } else {
                    setDegrees([{ degree: "Grado" }]);
                }

                // Verificar y establecer los datos de años
                if (Array.isArray(yearsData) && yearsData.length > 0) {
                    setYears([{ year: "Año" }, ...yearsData]);
                } else {
                    setYears([{ year: "Año" }]);
                }

                // Verificar y establecer los datos de tutores
                if (Array.isArray(advisorsData) && advisorsData.length > 0) {
                    setAdvisors([{ advisor: "Tutor" }, ...advisorsData]);
                } else {
                    setAdvisors([{ advisor: "Tutor" }]);
                }

                if (Array.isArray(tfgsData)) {
                    setTfgs(tfgsData);
                    // Registrar el primer elemento para verificar su estructura
                    if (tfgsData.length > 0) {
                        console.log("Primer TFG:", tfgsData[0]);
                    }
                } else {
                    // Transformar el objeto en un array de objetos
                    setTfgs([tfgsData]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setLoading(false);
            }
        };

        // Llamar a la función de carga
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, key } = e.target;
        setFormDataSearch(prev => ({
            ...prev,
            [name]: key
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof search === 'function') {
            search(formDataSearch);
        } else {
            console.error("La prop 'search' no es una función");
        }
    };

    // Mostrar estado de carga
    if (loading) {
        return <div className="text-center py-4"></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-black mb-10">
            {/* Input de búsqueda con datalist */}
            <div className="relative">
                <input
                    type="text"
                    name="search"
                    value={formDataSearch.search}
                    onChange={handleChange}
                    placeholder="Buscar..."
                    className="border border-gray-400 rounded-md px-2 py-1 w-full text-sm"
                    list="tfgSuggestions"
                    autoComplete="on"
                />

                {/* Datalist para sugerencias - mantener estructura original */}
                <datalist id="tfgSuggestions">
                    {tfgs.map((tfg, index) => (
                        <option
                            key={tfg?._id || `tfg-${index}`}
                            value={tfg?.tfg || ""}
                        />
                    ))}
                </datalist>
            </div>

            {/* Contenedor de filtros */}
            <div className="flex flex-wrap gap-2">
                {/* Select Año */}
                <select
                    name="year"
                    value={formDataSearch.year}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-md px-2 py-1 text-sm w-full sm:w-auto flex-1"
                >
                    {years.map((year, index) => (
                        <option
                            key={year?._id || `year-${index}`}
                            value={year?.year || ""}
                        >
                            {year?.year || ""}
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
                    {degrees.map((degree, index) => (
                        <option
                            key={degree?._id || `degree-${index}`}
                            value={degree?.degree || ""}
                        >
                            {degree?.degree || ""}
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
                    {advisors.map((advisor, index) => (
                        <option
                            key={advisor?._id || `advisor-${index}`}
                            value={advisor?.advisor || ""}
                        >
                            {advisor?.advisor || ""}
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
    );
}