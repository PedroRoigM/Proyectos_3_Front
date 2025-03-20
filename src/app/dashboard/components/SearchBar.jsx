// Componente: SearchBar
// Devuelve una barra de búsqueda con un input y un botón de búsqueda que al hacer click en él, se ejecuta la función search que se le pasa por props.
// Debe de dar sugerencias de búsqueda en tiempo real.
// Debe admitir el botón intro para realizar la búsqueda.
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
    const [degrees, setDegrees] = useState([{}]);
    const [years, setYears] = useState([{}]);
    const [advisors, setAdvisors] = useState([{}]);
    useEffect(() => {
        GetDegrees().then(degrees => setDegrees([null, ...degrees]));
        GetYears().then(years => setYears([null, ...years]));
        GetAdvisors().then(advisors => setAdvisors([null, ...advisors]));
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black p-4">
            {/* Input de búsqueda */}
            <input
                type="text"
                name="search"
                value={formDataSearch.search}
                onChange={handleChange}
                placeholder="Buscar..."
                className="border border-gray-500 rounded-md px-3 py-2 w-full text-lg"
            />

            {/* Contenedor responsive */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Select Año */}
                <div className="w-full">
                    <select
                        name="year"
                        value={formDataSearch.year}
                        onChange={handleChange}
                        className="border border-gray-500 rounded-md px-3 py-2 w-full text-lg"
                    >
                        {years.map((year, index) => (
                            <option key={year?.year || `year-${index}`} value={year?.year || ""}>
                                {year ? year.year : "Año"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Grado */}
                <div className="w-full">
                    <select
                        name="degree"
                        value={formDataSearch.degree}
                        onChange={handleChange}
                        className="border border-gray-500 rounded-md px-3 py-2 w-full text-lg"
                    >
                        {degrees.map((degree, index) => (
                            <option key={degree?._id || `degree-${index}`} value={degree?.degree || ""}>
                                {degree ? degree.degree : "Grado"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Tutor */}
                <div className="w-full">
                    <select
                        name="advisor"
                        value={formDataSearch.advisor}
                        onChange={handleChange}
                        className="border border-gray-500 rounded-md px-3 py-2 w-full text-lg"
                    >
                        {advisors.map((advisor, index) => (
                            <option key={advisor?._id || `advisor-${index}`} value={advisor?.advisor || ""}>
                                {advisor ? advisor.advisor : "Tutor"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botón de búsqueda */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold rounded-md px-3 py-2 text-lg hover:bg-blue-600 transition-all"
                >
                    Buscar
                </button>
            </div>
        </form>

    )
}