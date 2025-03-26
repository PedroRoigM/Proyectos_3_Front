'use client';
import PutTFG from '../../../../components/lib/PutTFG';
import GetTFG from '../../../../components/lib/GetTFG';
import GetAdvisors from '../../../../components/lib/GetAdvisors';
import GetDegrees from '../../../../components/lib/GetDegrees';
import GetYears from '../../../../components/lib/GetYears';
import LoadingSpinner from '../../../../components/LoadingSpinner';

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
        file: null //Initialize file as null
    });

    const id = useSearchParams().get('id');
    const [advisors, setAdvisors] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [years, setYears] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const [errors, setErrors] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);

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

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0]
        });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = async (confirm) => {
        setShowConfirmation(false);
        if (!confirm) return;

        const validationErrors = {};
        if (!formData.year) validationErrors.year = 'El año es obligatorio.';
        if (!formData.degree) validationErrors.degree = 'El grado es obligatorio.';
        if (!formData.student) validationErrors.student = 'El nombre del estudiante es obligatorio.';
        if (!formData.advisor) validationErrors.advisor = 'El tutor es obligatorio.';
        if (!formData.tfgTitle) validationErrors.tfgTitle = 'El título del TFG es obligatorio.';
        if (!formData.abstract) validationErrors.abstract = 'El resumen es obligatorio.';
        if (!formData.file) validationErrors.file = 'El archivo es obligatorio.';
        if (formData.keywords.length < 3) validationErrors.keywords = 'Añade al menos 3 palabras claves.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await PutTFG(id, formData);
            setErrors({ general: "✅ TFG actualizado correctamente." });
        } catch {
            setErrors({ general: '❌ Ha ocurrido un error, intenta de nuevo.' });
        }
    };

    if (loading) {
        return <LoadingSpinner message="Cargando formulario..." />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-5 bg-gradient-to-b from-white to-gray-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[50%] lg:w-[50%]">
                <h1 className="text-gray-800 font-bold text-2xl text-center mb-4">Actualizar TFG</h1>
                <form className="space-y-4">
                    {/* Título */}
                    <div>
                    <label className="block text-[#0065ef] font-semibold">Título</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                    />
                    </div>
                    {/* Resumen */}
                    <label className="block text-[#0065ef] font-semibold">Resumen</label>
                    <textarea

                        name="abstract"
                        value={formData.abstract}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                    />

                    {/* Año */}
                    <div>
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
                        {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                    </select>
                    </div>

                    {/* Grado */}
                    <div>
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
                        {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
                    </select>
                    </div>

                    {/* Asesor */}
                    <div>
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
                    </div>
                    {/* Alumno */}
                    <div>
                        <label className="block text-[#0065ef] font-semibold">Alumno</label>
                        <input
                            type="text"
                            name="student"
                            value={formData.student}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]"
                        />
                        {errors.student && <p className="text-red-500 text-sm">{errors.student}</p>}
                    </div>
                    {/*fichero*/}
                    <div>
                        <label className="text-gray-700 block mb-1">Archivo</label>
                        <input type="file" name="file" onChange={handleFileChange}
                        className={`w-full p-2 rounded-md border ${errors.file ? 'border-red-500' : 'border-gray-300'}`}
                        accept=".pdf" />
                        {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                    </div>

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
                        Actualizar
                    </button>
                </form>
                {showConfirmation && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
                            <p className="text-lg text-center mb-4">¿Estás seguro de actualizar el TFG?</p>
                            <div className="flex justify-around">
                                <button
                                    type="button"
                                    onClick={() => handleConfirmSubmit(true)}
                                    className="bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#1d4996] transition"
                                >
                                    Sí
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleConfirmSubmit(false)}
                                    className="px-8 text-black border-2 font-bold py-2 rounded-md hover:bg-[#9da3a7] transition"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
