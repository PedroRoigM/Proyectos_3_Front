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

    const handleSubmit = async () => {
        try {
            console.log(formData);
            if (!formData.year || !formData.degree || !formData.student || !formData.advisor || !formData.keywords || !formData.tfgTitle || !formData.abstract || !formData.file) {
                setError('Todos los campos son obligatorios.');
                return;
            }
            const { file, ...dataWithoutFile } = formData;
            const response = await PostTFG(dataWithoutFile);
            if (response.error) {
                setError(response.error);
                return;
            }
            await PatchTfgFile(response.id, file);
            setError('TFG subido correctamente.');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-5 bg-gradient-to-b from-white to-gray-300">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3">
                <h1 className="text-gray-800 font-bold text-2xl text-center mb-4">Subir TFG</h1>
                {error && <p className={`text-center text-lg mb-3 ${error.includes("✅") ? "text-green-500" : "text-red-500"}`}>{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-700 block mb-1">Año</label>
                        <select name="year" value={formData.year} onChange={handleChange} className="w-full p-2 rounded-md border border-gray-300">
                            <option value="">Selecciona un año</option>
                            {years.map(year => <option key={year._id} value={year.year}>{year.year}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Grado</label>
                        <select name="degree" value={formData.degree} onChange={handleChange} className="w-full p-2 rounded-md border border-gray-300">
                            <option value="">Selecciona un Grado</option>
                            {degrees.map(degree => <option key={degree._id} value={degree.degree}>{degree.degree}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Estudiante</label>
                        <input type="text" name="student" value={formData.student} onChange={handleChange} className="w-full p-2 rounded-md border border-gray-300" />
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Tutor</label>
                        <select name="advisor" value={formData.advisor} onChange={handleChange} className="w-full p-2 rounded-md border border-gray-300">
                            <option value="">Selecciona tu Tutor</option>
                            {advisors.map(advisor => <option key={advisor._id} value={advisor.advisor}>{advisor.advisor}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Título</label>
                        <input type="text" name="tfgTitle" value={formData.tfgTitle} onChange={handleChange} className="w-full p-2 rounded-md border border-gray-300" />
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Resumen</label>
                        <textarea name="abstract" value={formData.abstract} onChange={handleChange} className="w-full p-2 rounded-md border border-gray-300"></textarea>
                    </div>

                    <div>
                        <label className="text-gray-700 block mb-1">Archivo</label>
                        <input type="file" name="file" onChange={handleFileChange} className="w-full p-2 rounded-md border border-gray-300" />
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

                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition">Enviar</button>
                </form>
            </div>
        </div>
    );
}