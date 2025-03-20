'use client';
import { useEffect, useState } from 'react';
import PostTFG from '../components/lib/PostTFG';
import PatchTfgFile from '../components/lib/PatchTfgFile';
import GetAdvisors from '../components/lib/GetAdvisors';
import GetDegrees from '../components/lib/GetDegrees';
import GetYears from '../components/lib/GetYears';

export default function Page() {
    const [formData, setFormData] = useState({
        year: '',
        degree: '',
        student: '',
        advisor: '',
        keywords: [],
        tfgTitle: '',
        abstract: '',
        file: null, // Initialize file as null
    });
    const [advisors, setAdvisors] = useState([]);
    const [years, setYears] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false); // Estado para el cuadro de confirmación
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAdvisors = async () => {
            const response = await GetAdvisors();
            setAdvisors(response);
        };
        const fetchYears = async () => {
            const response = await GetYears();
            setYears(response);
        };
        const fetchDegrees = async () => {
            const response = await GetDegrees();
            setDegrees(response);
        };
        fetchAdvisors();
        fetchYears();
        fetchDegrees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
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

    const handleConfirmSubmit = async (isConfirmed) => {
        if (isConfirmed) {
            // Llamar al método de envío del formulario solo si el usuario confirma
            await handleSubmit();
        }
        setShowConfirmation(false); // Cierra el cuadro de confirmación
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const validationErrors = {};
        if (!formData.year) validationErrors.year = 'El año es obligatorio.';
        if (!formData.degree) validationErrors.degree = 'El grado es obligatorio.';
        if (!formData.student) validationErrors.student = 'El nombre del estudiante es obligatorio.';
        if (!formData.advisor) validationErrors.advisor = 'El tutor es obligatorio.';
        if (!formData.tfgTitle) validationErrors.tfgTitle = 'El título del TFG es obligatorio.';
        if (!formData.abstract) validationErrors.abstract = 'El resumen es obligatorio.';
        if (!formData.file) validationErrors.file = 'El archivo es obligatorio.';
        if (formData.keywords.length === 0) validationErrors.keywords = 'Añade al menos una palabra clave.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const { file, ...dataWithoutFile } = formData;
            const response = await PostTFG(dataWithoutFile);
            console.log(response)
            if (response.error) {
                setErrors({ general: response.error });
                setLoading(false);
                return;
            }

            await PatchTfgFile(response._id, file);
            setErrors({ general: "✅ TFG subido correctamente." });
        } catch {
            setErrors({ general: '❌ Ha ocurrido un error, intenta de nuevo.' });
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-5 bg-gradient-to-b from-white to-gray-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[50%] lg:w-[50%]">
                <h1 className="text-gray-800 font-bold text-2xl text-center mb-4">Subir TFG</h1>

                {loading && <p className="text-gray-500 text-center">Cargando...</p>}
                {errors.general && <p className={`text-center text-lg mb-3 ${errors.general.includes("✅") ? "text-green-500" : "text-red-500"}`}>{errors.general}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-700 block mb-1">Año</label>
                        <select name="year" value={formData.year} onChange={handleChange} className={`w-full p-2 rounded-md border ${errors.year ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Selecciona un año</option>
                            {years.map(year => <option key={year._id} value={year.year}>{year.year}</option>)}
                        </select>
                        {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Grado</label>
                        <select name="degree" value={formData.degree} onChange={handleChange} className={`w-full p-2 rounded-md border ${errors.degree ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Selecciona un Grado</option>
                            {degrees.map(degree => <option key={degree._id} value={degree.degree}>{degree.degree}</option>)}
                        </select>
                        {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Estudiante</label>
                        <input type="text" name="student" value={formData.student} onChange={handleChange} className={`w-full p-2 rounded-md border ${errors.student ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.student && <p className="text-red-500 text-sm">{errors.student}</p>}
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Tutor</label>
                        <select name="advisor" value={formData.advisor} onChange={handleChange} className={`w-full p-2 rounded-md border ${errors.advisor ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Selecciona tu Tutor</option>
                            {advisors.map(advisor => <option key={advisor._id} value={advisor.advisor}>{advisor.advisor}</option>)}
                        </select>
                        {errors.advisor && <p className="text-red-500 text-sm">{errors.advisor}</p>}
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Título</label>
                        <input type="text" name="tfgTitle" value={formData.tfgTitle} onChange={handleChange} className={`w-full p-2 rounded-md border ${errors.tfgTitle ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.tfgTitle && <p className="text-red-500 text-sm">{errors.tfgTitle}</p>}
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Resumen</label>
                        <textarea name="abstract" value={formData.abstract} onChange={handleChange} className={`w-full p-2 rounded-md border ${errors.abstract ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                        {errors.abstract && <p className="text-red-500 text-sm">{errors.abstract}</p>}
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Archivo</label>
                        <input type="file" name="file" onChange={handleFileChange} className={`w-full p-2 rounded-md border ${errors.file ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                    </div>

                    {/* Palabras clave */}
                    <div>
                        <label className="text-gray-700 block mb-1">Palabras clave</label>
                        <div className="flex items-center gap-2">
                            <input type="text" value={inputValue} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Añadir palabra clave..." />
                            <button type="button" onClick={handleAddKeyword} className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition">+</button>
                        </div>
                    </div>

                    {/* Lista de palabras clave */}
                    {formData.keywords.length > 0 && (
                        <ul className="mt-3 space-y-2">
                            {formData.keywords.map((keyword, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md">
                                    <span className="text-gray-800">{keyword}</span>
                                    <button type="button" onClick={() => handleRemoveKeyword(index)} className="text-red-500 hover:text-red-700">❌</button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md">Enviar</button>

                    {/*{showConfirmation && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-70">
                            <div className="bg-white p-8 rounded-lg shadow-lg w-[300px]">
                                <p className="text-lg text-center mb-4">¿Estás seguro de que quieres enviar el TFG?</p>
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
                        */}

                </form>
            </div>
        </div>
    );
}
