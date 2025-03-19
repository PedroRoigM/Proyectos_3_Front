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
        <div>
            <h1>Subir TFG</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div>
                <label>Año</label>
                <select name="year" value={formData.year} onChange={handleChange}>
                    {years.map(year => <option key={year._id} value={year.year}>{year.year}</option>)}
                </select>
            </div>
            <div>
                <label>Grado</label>
                <select name="degree" value={formData.degree} onChange={handleChange}>
                    {degrees.map(degree => <option key={degree._id} value={degree.degree}>{degree.degree}</option>)}
                </select>
            </div>
            <div>
                <label>Estudiante</label>
                <input type="text" name="student" value={formData.student} onChange={handleChange} />
            </div>
            <div>
                <label>Director</label>
                <select name="advisor" value={formData.advisor} onChange={handleChange}>
                    {advisors.map(advisor => <option key={advisor._id} value={advisor.advisor}>{advisor.advisor}</option>)}
                </select>
            </div>

            <div>
                <label>Título</label>
                <input type="text" name="tfgTitle" value={formData.tfgTitle} onChange={handleChange} />
            </div>
            <div>
                <label>Resumen</label>
                <textarea name="abstract" value={formData.abstract} onChange={handleChange}></textarea>
            </div>
            <div>
                <label>Archivo</label>
                <input type="file" name="file" onChange={handleFileChange} />
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
            <button onClick={handleSubmit}>Enviar</button>
        </div>
    )
}