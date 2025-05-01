'use client';
import { useState, useEffect } from "react";
import GetDegrees from "./lib/GetDegrees";
import GetAdvisors from "./lib/GetAdvisors";
import GetYears from "./lib/GetYears";
import GetTFGsNames from "./lib/GetTFGsNames";

export default function SearchBar({ search }) {
    // Conservar tanto los valores mostrados como los IDs
    const [formDataSearch, setFormDataSearch] = useState({
        year: "",
        yearId: "",
        degree: "",
        degreeId: "",
        advisor: "",
        advisorId: "",
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
                    setDegrees([{ _id: "", degree: "Grado" }, ...degreesData]);
                } else {
                    setDegrees([{ _id: "", degree: "Grado" }]);
                }

                // Verificar y establecer los datos de años
                if (Array.isArray(yearsData) && yearsData.length > 0) {
                    setYears([{ _id: "", year: "Año" }, ...yearsData]);
                } else {
                    setYears([{ _id: "", year: "Año" }]);
                }

                // Verificar y establecer los datos de tutores
                if (Array.isArray(advisorsData) && advisorsData.length > 0) {
                    setAdvisors([{ _id: "", advisor: "Tutor" }, ...advisorsData]);
                } else {
                    setAdvisors([{ _id: "", advisor: "Tutor" }]);
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

    // Manejar cambios en el input de búsqueda de texto
    const handleSearchInputChange = (e) => {
        const { value } = e.target;
        setFormDataSearch(prev => ({
            ...prev,
            search: value
        }));
    };

    // Manejar cambios en los selectores (año, grado, tutor)
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        const selectedIndex = e.target.selectedIndex;

        // Casos según el tipo de selector
        switch (name) {
            case "year":
                const yearObj = years[selectedIndex];
                console.log(`Seleccionado año: ${value} con ID: ${yearObj?._id || ""}`);
                setFormDataSearch(prev => ({
                    ...prev,
                    year: value,
                    yearId: yearObj?._id || ""
                }));
                break;

            case "degree":
                const degreeObj = degrees[selectedIndex];
                console.log(`Seleccionado grado: ${value} con ID: ${degreeObj?._id || ""}`);
                setFormDataSearch(prev => ({
                    ...prev,
                    degree: value,
                    degreeId: degreeObj?._id || ""
                }));
                break;

            case "advisor":
                const advisorObj = advisors[selectedIndex];
                console.log(`Seleccionado tutor: ${value} con ID: ${advisorObj?._id || ""}`);
                setFormDataSearch(prev => ({
                    ...prev,
                    advisor: value,
                    advisorId: advisorObj?._id || ""
                }));
                break;

            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Crear objeto de datos para enviar con IDs en lugar de nombres
        const searchData = {
            year: formDataSearch.yearId || "",     // Usar el ID del año
            degree: formDataSearch.degreeId || "", // Usar el ID del grado
            advisor: formDataSearch.advisorId || "", // Usar el ID del tutor
            search: formDataSearch.search || ""
        };

        console.log("Enviando búsqueda:", searchData);

        if (typeof search === 'function') {
            search(searchData);
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
                    onChange={handleSearchInputChange}
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
                    onChange={handleSelectChange}
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
                    onChange={handleSelectChange}
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
                    onChange={handleSelectChange}
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