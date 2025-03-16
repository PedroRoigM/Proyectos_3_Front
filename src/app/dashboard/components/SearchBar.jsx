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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
            <input
                type="text"
                name="search"
                value={formDataSearch.search}
                onChange={handleChange}
                placeholder="Buscar..."
                className="border border-gray-500 rounded-md px-2 py-1 w-full"
            />

            <div className="flex gap-4">
                <div className="flex flex-col w-full mb-4">
                    <select
                        name="year"
                        value={formDataSearch.year}
                        onChange={handleChange}
                        className="border border-gray-500 rounded-md px-2 py-1"
                    >
                        {years.map((year, index) => (
                            <option key={year?.year || `year-${index}`} value={year?.year || ""}>
                                {year ? year.year : "Año"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col w-full mb-4">
                    <select
                        name="degree"
                        value={formDataSearch.degree}
                        onChange={handleChange}
                        className="border border-gray-500 rounded-md px-2 py-1"
                    >
                        {degrees.map((degree, index) => (
                            <option key={degree?._id || `degree-${index}`} value={degree?.degree || ""}>
                                {degree ? degree.degree : "Grado"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col w-full mb-4">
                    <select
                        name="advisor"
                        value={formDataSearch.advisor}
                        onChange={handleChange}
                        className="border border-gray-500 rounded-md px-2 py-1"
                    >
                        {advisors.map((advisor, index) => (
                            <option key={advisor?._id || `advisor-${index}`} value={advisor?.advisor || ""}>
                                {advisor ? advisor.advisor : "Tutor"}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="border border-gray-500 rounded-md w-full bg-blue-500 text-white hover:bg-blue-600"
                >
                    Buscar
                </button>
            </div>


        </form>
    )
}