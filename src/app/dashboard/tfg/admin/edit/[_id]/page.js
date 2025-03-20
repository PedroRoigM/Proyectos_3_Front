'use client';
import PutTFG from '../../../../components/lib/PutTFG';
import GetTFG from '../../../../components/lib/GetTFG';
import GetAdvisors from '../../../../components/lib/GetAdvisors';
import GetDegrees from '../../../../components/lib/GetDegrees';
import GetYears from '../../../../components/lib/GetYears';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [loading, setLoading] = useState(true); // Estado de carga
    const [formData, setFormData] = useState({
        year: '',
        degree: '',
        tfgTitle: '',
        abstract: '',
        advisor: '',
        student: '',
        keywords: [],
    });

    const id = useSearchParams().get('id');
    const [advisors, setAdvisors] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [years, setYears] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [advisorsRes, degreesRes, yearsRes, tfgRes] = await Promise.all([
                    GetAdvisors(),
                    GetDegrees(),
                    GetYears(),
                    GetTFG(id),
                ]);

                setAdvisors(advisorsRes);
                setDegrees(degreesRes);
                setYears(yearsRes);
                setFormData({
                    title: tfgRes.tfgTitle,
                    abstract: tfgRes.abstract,
                    advisor: tfgRes.advisor,
                    student: tfgRes.student,
                    keywords: tfgRes.keywords,
                    year: tfgRes.year,
                    degree: tfgRes.degree
                });
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleAddKeyword = () => {
        if (inputValue.trim() !== "" && !formData.keywords.includes(inputValue.trim())) {
            setFormData({
                ...formData,
                keywords: [...formData.keywords, inputValue.trim()]
            });
            setInputValue("");
        }
    };

    const handleRemoveKeyword = (index) => {
        setFormData({
            ...formData,
            keywords: formData.keywords.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async () => {
        await PutTFG(id, formData);
    };

    if (loading) {
        return <div className="text-center text-[#0065ef] font-bold text-lg">Cargando...</div>;
    }

    return (
        <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-[#0065ef] mb-4">Editar TFG</h1>
            <form className="space-y-4">
                {/* Título */}
                <label className="block text-[#0065ef] font-semibold">Título</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                />

                {/* Resumen */}
                <label className="block text-[#0065ef] font-semibold">Resumen</label>
                <textarea

                    name="abstract"
                    value={formData.abstract}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                />

                {/* Año */}
                <label className="block text-[#0065ef] font-semibold">Año</label>
                <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                >
                    <option value="" disabled>{formData.year || "Selecciona un año"}</option>
                    {years.map((year) => (
                        <option key={year._id} value={year.year}>{year.year}</option>
                    ))}
                </select>

                {/* Grado */}
                <label className="block text-[#0065ef] font-semibold">Grado</label>
                <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                >
                    <option value="" disabled>{formData.degree || "Selecciona un grado"}</option>
                    {degrees.map((degree) => (
                        <option key={degree._id} value={degree.degree}>{degree.degree}</option>
                    ))}
                </select>

                {/* Asesor */}
                <label className="block text-[#0065ef] font-semibold">Asesor</label>
                <select
                    name="advisor"
                    value={formData.advisor}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                >
                    <option value="" disabled>{formData.advisor || "Selecciona un asesor"}</option>
                    {advisors.map((advisor) => (
                        <option key={advisor._id} value={advisor.advisor}>{advisor.advisor}</option>
                    ))}
                </select>

                {/* Alumno */}
                <label className="block text-[#0065ef] font-semibold">Alumno</label>
                <input
                    type="text"
                    name="student"
                    value={formData.student}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                />

                {/* Palabras clave */}
                <label className="block text-[#0065ef] font-semibold">Palabras clave</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                        placeholder="Añadir palabra clave..."
                    />
                    <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="bg-[#0065ef] text-white font-bold px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        +
                    </button>
                </div>

                {/* Lista de palabras clave */}
                <ul className="mt-3 space-y-2">
                    {formData.keywords.map((keyword, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md">
                            <span className="text-gray-800">{keyword}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveKeyword(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ❌
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Botón */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-[#0065ef] text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}
