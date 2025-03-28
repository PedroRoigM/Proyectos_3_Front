// Este componente es una barra de búsqueda que permite filtrar TFGs (Trabajos de Fin de Grado) 
// según diferentes criterios: año, grado, tutor y texto de búsqueda.
// Utiliza datos obtenidos de funciones externas para rellenar los filtros dinámicamente.
// Recibe una función `search` como prop para manejar la búsqueda.

'use client'; // Indica que este componente se ejecuta en el cliente.
import { useState, useEffect } from "react";
import GetDegrees from "./lib/GetDegrees"; // Función para obtener los grados.
import GetAdvisors from "./lib/GetAdvisors"; // Función para obtener los tutores.
import GetYears from "./lib/GetYears"; // Función para obtener los años.
import GetTFGsNames from "./lib/GetTFGsNames"; // Función para obtener los nombres de los TFGs.

export default function SearchBar({ search }) {
    // Estado para almacenar los datos del formulario de búsqueda.
    const [formDataSearch, setFormDataSearch] = useState({
        year: "", // Año seleccionado.
        degree: "", // Grado seleccionado.
        advisor: "", // Tutor seleccionado.
        search: "" // Texto de búsqueda.
    });

    // Estados para almacenar los datos dinámicos de los filtros.
    const [degrees, setDegrees] = useState([]); // Lista de grados.
    const [years, setYears] = useState([]); // Lista de años.
    const [advisors, setAdvisors] = useState([]); // Lista de tutores.
    const [tfgs, setTfgs] = useState([]); // Lista de nombres de TFGs.
    const [loading, setLoading] = useState(true); // Estado de carga.

    // useEffect para cargar los datos al montar el componente.
    useEffect(() => {
        // Función para cargar todos los datos necesarios para los filtros.
        const loadData = async () => {
            try {
                // Cargar datos en paralelo usando Promise.all.
                const [degreesData, yearsData, advisorsData, tfgsData] = await Promise.all([
                    GetDegrees().catch(() => []), // Obtener grados.
                    GetYears().catch(() => []), // Obtener años.
                    GetAdvisors().catch(() => []), // Obtener tutores.
                    GetTFGsNames().catch(() => []) // Obtener nombres de TFGs.
                ]);

                // Configurar los datos de grados.
                if (Array.isArray(degreesData) && degreesData.length > 0) {
                    setDegrees([{ degree: "Grado" }, ...degreesData]); // Agregar opción por defecto.
                } else {
                    setDegrees([{ degree: "Grado" }]); // Solo opción por defecto si no hay datos.
                }

                // Configurar los datos de años.
                if (Array.isArray(yearsData) && yearsData.length > 0) {
                    setYears([{ year: "Año" }, ...yearsData]); // Agregar opción por defecto.
                } else {
                    setYears([{ year: "Año" }]); // Solo opción por defecto si no hay datos.
                }

                // Configurar los datos de tutores.
                if (Array.isArray(advisorsData) && advisorsData.length > 0) {
                    setAdvisors([{ advisor: "Tutor" }, ...advisorsData]); // Agregar opción por defecto.
                } else {
                    setAdvisors([{ advisor: "Tutor" }]); // Solo opción por defecto si no hay datos.
                }

                // Configurar los nombres de TFGs.
                if (Array.isArray(tfgsData)) {
                    setTfgs(tfgsData); // Guardar los datos si son un array.
                    if (tfgsData.length > 0) {
                        console.log("Primer TFG:", tfgsData[0]); // Log para verificar estructura.
                    }
                } else {
                    setTfgs([tfgsData]); // Transformar en array si no lo es.
                }

                setLoading(false); // Finalizar estado de carga.
            } catch (error) {
                console.error("Error al cargar datos:", error); // Manejo de errores.
                setLoading(false);
            }
        };

        loadData(); // Llamar a la función de carga.
    }, []);

    // Manejar cambios en los inputs del formulario.
    const handleChange = (e) => {
        const { name, value } = e.target; // Obtener nombre y valor del input.
        setFormDataSearch(prev => ({
            ...prev, // Mantener el estado anterior.
            [name]: value // Actualizar el campo correspondiente.
        }));
    };

    // Manejar el envío del formulario.
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto.
        if (typeof search === 'function') {
            search(formDataSearch); // Llamar a la función de búsqueda con los datos del formulario.
        } else {
            console.error("La prop 'search' no es una función"); // Manejo de error si `search` no es una función.
        }
    };

    // Mostrar un mensaje de carga mientras se obtienen los datos.
    if (loading) {
        return <div className="text-center py-4">Cargando...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-black">
            {/* Input de búsqueda con sugerencias (datalist) */}
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