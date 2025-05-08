'use client';
import PutTFG from '../../../../components/lib/PutTFG';
import PatchTfgFile from '../../../../components/lib/PatchTfgFile';
import GetTFG from '../../../../components/lib/GetTFG';
import GetAdvisors from '../../../../components/lib/GetAdvisors';
import GetDegrees from '../../../../components/lib/GetDegrees';
import GetYears from '../../../../components/lib/GetYears';
import GetTFGpdf from '../../../../components/lib/GetTFGpdf';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        year: '',
        yearId: '',
        degree: '',
        degreeId: '',
        tfgTitle: '',
        abstract: '',
        advisor: '',
        advisorId: '',
        student: '',
        keywords: [],
        file: null
    });

    const id = useSearchParams().get('id');
    const [advisors, setAdvisors] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [years, setYears] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [errors, setErrors] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 3; // Número de palabras clave visibles por defecto

    // Para manejar el evento contextmenu
    const pdfContainerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todos los datos en paralelo
                const [advisorsRes, degreesRes, yearsRes, tfgRes, file] = await Promise.all([
                    GetAdvisors({ active: true }),
                    GetDegrees({ active: true }),
                    GetYears({ active: true }),
                    GetTFG(id),
                    GetTFGpdf(id)
                ]);

                setAdvisors(advisorsRes);
                setDegrees(degreesRes);
                setYears(yearsRes);
                setFormData({
                    tfgTitle: tfgRes.tfgTitle,
                    abstract: tfgRes.abstract,
                    advisor: tfgRes.advisor.advisor || tfgRes.advisor,
                    advisorId: tfgRes.advisor._id || tfgRes.advisorId,
                    student: tfgRes.student,
                    keywords: tfgRes.keywords,
                    year: tfgRes.year.year || tfgRes.year,
                    yearId: tfgRes.year._id || tfgRes.yearId,
                    degree: tfgRes.degree.degree || tfgRes.degree,
                    degreeId: tfgRes.degree._id || tfgRes.degreeId,
                    file: file,
                });
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setErrors({ general: "Error al cargar los datos del TFG. Inténtalo de nuevo." });
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Añadir protección contra atajos de teclado para descargar
        const handleKeyDown = (e) => {
            if ((e.ctrlKey && e.key === 's') ||
                (e.ctrlKey && e.key === 'p') ||
                (e.ctrlKey && e.shiftKey && e.key === 's')) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [id]);

    // Función para descargar el PDF
    const downloadPDF = () => {
        if (formData.file) {
            try {
                // Crear un Uint8Array a partir del ArrayBuffer del PDF
                const uint8Array = new Uint8Array(formData.file);

                // Crear un Blob usando el array de bytes
                const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });

                // Crear la URL del objeto
                const pdfUrl = URL.createObjectURL(pdfBlob);

                // Crear el elemento para la descarga
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = `${formData.tfgTitle}.pdf`; // Nombre del archivo PDF

                // Añadir al documento, hacer clic y eliminar
                document.body.appendChild(a);
                a.click();

                // Pequeño retraso antes de limpiar para asegurar que la descarga comience
                setTimeout(() => {
                    URL.revokeObjectURL(pdfUrl); // Liberar el objeto URL
                    a.remove(); // Eliminar el elemento <a> después de la descarga
                }, 100);
            } catch (error) {
                console.error("Error al descargar el PDF:", error);
                setErrors({ file: "Error al descargar el archivo. Inténtalo más tarde." });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Para campos especiales con ID, manejamos tanto el valor como el ID
        if (name === "advisor") {
            const selectedAdvisor = advisors.find(a => a.advisor === value);
            if (selectedAdvisor) {
                setFormData({
                    ...formData,
                    advisor: value,
                    advisorId: selectedAdvisor._id
                });
            }
        } else if (name === "year") {
            const selectedYear = years.find(y => y.year === value);
            if (selectedYear) {
                setFormData({
                    ...formData,
                    year: value,
                    yearId: selectedYear._id
                });
            }
        } else if (name === "degree") {
            const selectedDegree = degrees.find(d => d.degree === value);
            if (selectedDegree) {
                setFormData({
                    ...formData,
                    degree: value,
                    degreeId: selectedDegree._id
                });
            }
        } else {
            // Para el resto de los campos normales
            setFormData({ ...formData, [name]: value });
        }

        // Limpiar errores al cambiar un campo
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0]
        });
        
        // Limpiar error de archivo
        if (errors.file) {
            setErrors({ ...errors, file: "" });
        }
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleAddKeyword = () => {
        if (inputValue.trim() !== "" && !formData.keywords.includes(inputValue.trim())) {
            setFormData({
                ...formData,
                keywords: [...formData.keywords, inputValue.trim()]
            });
            setInputValue("");
            
            // Limpiar error de keywords
            if (errors.keywords) {
                setErrors({ ...errors, keywords: "" });
            }
        }
    };

    const handleRemoveKeyword = (index) => {
        setFormData({
            ...formData,
            keywords: formData.keywords.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        setShowConfirmation(true);
    };

    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAdvisors, setFilteredAdvisors] = useState([]);
    const advisorRef = useRef(null);

    // Función para filtrar tutores
    useEffect(() => {
        if (searchTerm) {
            const filtered = advisors.filter(advisor => 
                advisor.advisor.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAdvisors(filtered);
        } else {
            setFilteredAdvisors(advisors);
        }
    }, [searchTerm, advisors]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (advisorRef.current && !advisorRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Manejar el evento contextmenu para prevenir clic derecho
    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    const handleConfirmSubmit = async (confirmed) => {
        if (!confirmed) {
            setShowConfirmation(false);
            return;
        }

        setShowConfirmation(false);
        
        // Validar formulario
        const validationErrors = {};
        if (!formData.year) validationErrors.year = 'El año es obligatorio.';
        if (!formData.degree) validationErrors.degree = 'El grado es obligatorio.';
        if (!formData.student) validationErrors.student = 'El nombre del estudiante es obligatorio.';
        if (!formData.advisor) validationErrors.advisor = 'El tutor es obligatorio.';
        if (!formData.tfgTitle) validationErrors.tfgTitle = 'El título del TFG es obligatorio.';
        if (!formData.abstract) validationErrors.abstract = 'El resumen es obligatorio.';
        if (formData.keywords.length < 3) validationErrors.keywords = 'Añade al menos 3 palabras claves.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Preparar datos para enviar al backend
            const dataToSend = {
                ...formData,
                advisor: formData.advisorId,
                year: formData.yearId,
                degree: formData.degreeId
            };

            // Actualizar TFG
            const response = await PutTFG(id, dataToSend);
            
            // Comprobar si se ha cambiado el archivo
            if (formData.file && typeof formData.file !== 'string') {
                const responseFile = await PatchTfgFile(id, formData.file);
                if (!responseFile) {
                    setErrors({ general: '❌ Error al actualizar el archivo, pero los demás datos se guardaron correctamente.' });
                    return;
                }
            }
            
            setSuccessMessage("✅ TFG actualizado correctamente");
            setErrors({});
            // Mostrar mensaje por 3 segundos y luego redirigir
            setTimeout(() => {
                window.location.href = `/dashboard/admin/tfg/${id}?id=${id}`;
            }, 2000);
        } catch (error) {
            console.error("Error al actualizar:", error);
            setErrors({ general: '❌ Ha ocurrido un error al actualizar el TFG. Por favor, inténtalo de nuevo.' });
        }
    };

    // Renderizar pantalla de carga
    if (loading) {
        return <LoadingSpinner message="Cargando formulario..." />;
    }

    // Renderizar error si no hay datos
    if (!formData.tfgTitle) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl text-red-600 font-bold">No se encontró el TFG</h2>
                <p className="mt-4">El TFG solicitado no existe o no tienes permisos para acceder.</p>
            </div>
        );
    }

    return (
        <div className="font-montserrat w-full h-full min-h-screen bg-gray-100">
            {/* Cabecera con título y botones de acción */}
            <div className="flex items-center justify-between p-5 pr-3 pl-3 bg-white border-b-[2px] border-[#14192c] shadow-md">
                <h2 className="text-xl font-semibold">{formData.tfgTitle}</h2>
                <div className="flex gap-4">
                    <button 
                        onClick={handleSubmit}
                        className="bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#14192c] transition"
                    >
                        Guardar
                    </button>
                    <button 
                        onClick={downloadPDF}
                        className="text-black border-gray-400 border-2 font-bold px-4 py-2 rounded-md hover:bg-[#9da3a7] transition"
                    >
                        Descargar
                    </button>
                    <Link 
                        href={`/dashboard/admin/tfg/${id}?id=${id}`}
                        className="text-black border-gray-400 border-2 font-bold px-4 py-2 rounded-md hover:bg-[#9da3a7] transition"
                    >
                        Ver TFG
                    </Link>
                </div>
            </div>

            {/* Panel de información y keywords */}
            <div className="bg-[#e5e9ec] flex flex-wrap items-center justify-between p-5 pr-3 pl-3 rounded-md max-w-full overflow-hidden mx-auto my-4 max-w-7xl">
                {/* Palabras clave */}
                <div className="flex gap-2 flex-wrap">
                    {formData.keywords.slice(0, showAll ? formData.keywords.length : maxVisible).map((keyword, index) => (
                        <span key={index} className="border border-gray-500 rounded-md px-2 py-1">
                            {keyword}
                        </span>
                    ))}
                    {formData.keywords.length > maxVisible && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-blue-500 underline ml-2"
                        >
                            {showAll ? "Ver menos" : "Ver más"}
                        </button>
                    )}
                </div>

                {/* Información de Año y Tutor */}
                <div className="flex ml-auto text-right gap-x-4">
                    <p><strong>Año:</strong> {formData.year}</p>
                    <p><strong>Tutor:</strong> {formData.advisor}</p>
                </div>
            </div>

            {/* Contenedor del resumen */}
            <div className="mt-2 mb-8 bg-[#BEBEBE] p-5 border border-[#000000] max-w-7xl mx-auto">
                <textarea
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:outline-none resize-none p-2"
                    rows="5"
                />
                {errors.abstract && <p className="text-red-500 text-sm mt-2">{errors.abstract}</p>}
            </div>

            {/* Mensajes de error o éxito */}
            {(errors.general || successMessage) && (
                <div className={`max-w-7xl mx-auto mb-4 p-4 rounded-md ${errors.general ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {errors.general || successMessage}
                </div>
            )}

            {/* Sección del PDF */}
            <div className="mt-4 max-w-7xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Documento TFG</h2>

                {/* Formulario para cambiar el archivo */}
                <div className="mb-6 bg-white p-4 rounded-md shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {typeof formData.file === 'string' ? 
                                'Archivo PDF actual del TFG' : 
                                formData.file ? formData.file.name : 'No se ha seleccionado un archivo'
                            }
                        </div>
                        <label className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition">
                            Cambiar archivo
                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf"
                            />
                        </label>
                    </div>
                    {errors.file && <p className="text-red-500 text-sm mt-2">{errors.file}</p>}
                </div>

                {/* Visualizador de PDF */}
                {formData.file && (
                    <div>
                        <div className="relative w-full h-[800px] overflow-hidden rounded bg-gray-100 shadow-lg" 
                             ref={pdfContainerRef} 
                             onContextMenu={handleContextMenu}>
                            
                            {/* Marca de agua */}
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="transform rotate-45 text-gray-400 text-5xl font-bold opacity-10 whitespace-nowrap">
                                    SOLO VISUALIZACIÓN
                                </div>
                            </div>

                            {/* Visualizador de PDF */}
                            <div className="w-full h-full overflow-hidden">
                                <object
                                    data={`data:application/pdf;base64,${Buffer.from(formData.file).toString('base64')}`}
                                    type="application/pdf"
                                    className="w-full h-[calc(100%+40px)] -mt-10 border-0"
                                >
                                    <p className="p-4 text-center">Tu navegador no puede mostrar PDFs.</p>
                                </object>
                            </div>

                            {/* Capa superior para bloquear interacciones */}
                            <div className="absolute top-0 left-0 right-0 h-10 bg-white opacity-0 z-20"></div>
                        </div>

                        <div className="bg-gray-100 p-3 rounded text-center text-sm text-gray-600 mt-2">
                            Este documento está protegido. Visualización solo con fines académicos.
                        </div>
                    </div>
                )}
            </div>

            {/* Campos adicionales para editar */}
            <div className="max-w-7xl mx-auto mt-8 mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Título */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                    <label className="block text-gray-700 font-medium mb-2">Título</label>
                    <input
                        type="text"
                        name="tfgTitle"
                        value={formData.tfgTitle}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.tfgTitle ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {errors.tfgTitle && <p className="text-red-500 text-sm mt-1">{errors.tfgTitle}</p>}
                </div>

                {/* Año */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                    <label className="block text-gray-700 font-medium mb-2">Año</label>
                    <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white`}
                    >
                        <option value="" disabled>Selecciona un año</option>
                        {years.map((year) => (
                            <option key={year._id} value={year.year}>{year.year}</option>
                        ))}
                    </select>
                    {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                </div>

                {/* Grado */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                    <label className="block text-gray-700 font-medium mb-2">Grado</label>
                    <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.degree ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white`}
                    >
                        <option value="" disabled>Selecciona un grado</option>
                        {degrees.map((degree) => (
                            <option key={degree._id} value={degree.degree}>{degree.degree}</option>
                        ))}
                    </select>
                    {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
                </div>

                {/* Tutor */}
                <div className="bg-white p-4 rounded-md shadow-sm" ref={advisorRef}>
                    <label className="block text-gray-700 font-medium mb-2">Tutor</label>
                    <div className="relative">
                        <div 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className={`w-full p-2 border ${errors.advisor ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white flex justify-between items-center cursor-pointer`}
                        >
                            <span>{formData.advisor || "Selecciona un tutor"}</span>
                            <svg className={`w-5 h-5 transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        
                        {showDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                                    <input
                                        type="text"
                                        placeholder="Buscar tutor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                
                                {filteredAdvisors.length > 0 ? (
                                    filteredAdvisors.map((advisor) => (
                                        <div
                                            key={advisor._id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                handleChange({
                                                    target: {
                                                        name: "advisor",
                                                        value: advisor.advisor
                                                    }
                                                });
                                                setShowDropdown(false);
                                                setSearchTerm("");
                                            }}
                                        >
                                            {advisor.advisor}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-2 text-gray-500">No se encontraron tutores</div>
                                )}
                            </div>
                        )}
                    </div>
                    {errors.advisor && <p className="text-red-500 text-sm mt-1">{errors.advisor}</p>}
                </div>

                {/* Alumno */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                    <label className="block text-gray-700 font-medium mb-2">Alumno</label>
                    <input
                        type="text"
                        name="student"
                        value={formData.student}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.student ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {errors.student && <p className="text-red-500 text-sm mt-1">{errors.student}</p>}
                </div>

                {/* Palabras clave */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                    <label className="block text-gray-700 font-medium mb-2">Palabras clave</label>
                    <div className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                            placeholder="Añadir palabra clave..."
                            className={`flex-1 p-2 border ${errors.keywords ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        <button
                            type="button"
                            onClick={handleAddKeyword}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Añadir
                        </button>
                    </div>
                    
                    {errors.keywords && <p className="text-red-500 text-sm mb-2">{errors.keywords}</p>}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.keywords.map((keyword, index) => (
                            <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded-md border border-gray-300">
                                <span>{keyword}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveKeyword(index)}
                                    className="ml-2 bg-gray-200 text-red-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    title="Eliminar palabra clave"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
                        <h3 className="text-lg text-center mb-4">¿Estás seguro de actualizar el TFG?</h3>
                        <div className="flex justify-around">
                            <button
                                onClick={() => handleConfirmSubmit(true)}
                                className="bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#1d4996] transition"
                            >
                                Sí
                            </button>
                            <button
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
    );
}