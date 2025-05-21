'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PostTFG from './lib/PostTFG';
import PatchTfgFile from './lib/PatchTfgFile';
import GetAdvisors from './lib/GetAdvisors';
import GetDegrees from './lib/GetDegrees';
import GetYears from './lib/GetYears';
import LoadingSpinner from './LoadingSpinner';
import Link from "next/link";
import { editTfgStyles, inputClassName, selectClassName } from '../admin/components/styles/edit-tfg';
import { ErrorBoundary } from '../../components/errors/error-boundary';
import { useNotification } from '../../components/errors/notification-context';
import { useApiError } from '../../components/errors/api-error-hook';
import { validateTFGForm } from '../../components/errors/FormValidation';

function UploadTFGContent() {
    const router = useRouter();
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

    const [advisors, setAdvisors] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [years, setYears] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [errors, setErrors] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAdvisors, setFilteredAdvisors] = useState([]);
    const advisorRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const { showSuccess, showError } = useNotification();
    const { loading: apiLoading, executeRequest } = useApiError();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [advisorsRes, degreesRes, yearsRes] = await Promise.all([
                    GetAdvisors({ active: true }),
                    GetDegrees({ active: true }),
                    GetYears({ active: true })
                ]);

                setAdvisors(advisorsRes || []);
                setDegrees(degreesRes || []);
                setYears(yearsRes || []);
            } catch (error) {
                setErrors({ general: "Error al cargar los datos del formulario. Inténtalo de nuevo." });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredAdvisors(advisors.filter(advisor =>
                advisor.advisor.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            setFilteredAdvisors(advisors);
        }
    }, [searchTerm, advisors]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (advisorRef.current && !advisorRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        function handleScroll() {
            setShowDropdown(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "advisor") {
            const selectedAdvisor = advisors.find(a => a.advisor === value);
            if (selectedAdvisor) {
                setFormData({ ...formData, advisor: value, advisorId: selectedAdvisor._id });
            }
        } else if (name === "year") {
            const selectedYear = years.find(y => y.year === value);
            if (selectedYear) {
                setFormData({ ...formData, year: value, yearId: selectedYear._id });
            }
        } else if (name === "degree") {
            const selectedDegree = degrees.find(d => d.degree === value);
            if (selectedDegree) {
                setFormData({ ...formData, degree: value, degreeId: selectedDegree._id });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
        if (errors.file) setErrors({ ...errors, file: "" });
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleAddKeyword = () => {
        if (inputValue.trim() !== "" && !formData.keywords.includes(inputValue.trim())) {
            setFormData({
                ...formData,
                keywords: [...formData.keywords, inputValue.trim()]
            });
            setInputValue("");
            if (errors.keywords) setErrors({ ...errors, keywords: "" });
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

    const handleConfirmSubmit = async (confirmed) => {
        if (!confirmed) {
            setShowConfirmation(false);
            return;
        }
        setShowConfirmation(false);

        // Validación
        const validationErrors = validateTFGForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Formatear los datos para la API
            const dataToSend = {
                tfgTitle: formData.tfgTitle,
                abstract: formData.abstract,
                advisor: formData.advisorId,
                student: formData.student,
                keywords: formData.keywords,
                year: formData.yearId,
                degree: formData.degreeId
            };

            // Paso 1: Crear el TFG
            const tfgResponse = await PostTFG(dataToSend);

            if (!tfgResponse || tfgResponse.error) {
                setErrors({ general: 'Error al crear el TFG. Por favor, inténtalo de nuevo.' });
                return;
            }

            // Paso 2: Subir el archivo PDF
            if (formData.file) {
                await PatchTfgFile(tfgResponse._id, formData.file);
            }

            setSuccessMessage("✅ TFG creado correctamente");
            setErrors({});
            setTimeout(() => {
                window.location.href = `/dashboard`;
            }, 2000);
        } catch (error) {
            setErrors({ general: '❌ Ha ocurrido un error al crear el TFG. Por favor, inténtalo de nuevo.' });
        }
    };

    if (loading) {
        return <LoadingSpinner message="Cargando formulario..." />;
    }

    return (
        <div className={editTfgStyles.layout.container}>
            <div className={editTfgStyles.layout.formContainer}>
                {/* Cabecera */}
                <div className={editTfgStyles.header.container}>
                    <h2 className={editTfgStyles.header.title}>Subir nuevo TFG</h2>
                    <div className={editTfgStyles.header.actionsContainer}>
                        <button onClick={handleSubmit} className={editTfgStyles.header.editButton}>Guardar</button>
                        <Link href="/dashboard" className={editTfgStyles.header.secondaryButton}>Cancelar</Link>
                    </div>
                </div>

                {(errors.general || successMessage) && (
                    <div className={successMessage ? editTfgStyles.feedback.success : editTfgStyles.feedback.error}>
                        {errors.general || successMessage}
                    </div>
                )}

                {/* Resumen */}
                <div className={editTfgStyles.abstract.container}>
                    <textarea
                        name="abstract"
                        value={formData.abstract}
                        onChange={handleChange}
                        className={editTfgStyles.abstract.textarea}
                        placeholder="Escribe aquí el resumen del TFG..."
                        rows="5"
                    />
                    {errors.abstract && <p className={editTfgStyles.form.error}>{errors.abstract}</p>}
                </div>

                {/* Formulario */}
                <div className={editTfgStyles.form.container}>
                    {/* Título */}
                    <div className={editTfgStyles.form.group}>
                        <label className={editTfgStyles.form.label}>Título</label>
                        <input
                            type="text"
                            name="tfgTitle"
                            value={formData.tfgTitle}
                            onChange={handleChange}
                            className={inputClassName(errors.tfgTitle)}
                            placeholder="Título del TFG"
                        />
                        {errors.tfgTitle && <p className={editTfgStyles.form.error}>{errors.tfgTitle}</p>}
                    </div>
                    {/* Año */}
                    <div className={editTfgStyles.form.group}>
                        <label className={editTfgStyles.form.label}>Año</label>
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className={selectClassName(errors.year)}
                        >
                            <option value="" disabled>Selecciona un año</option>
                            {years.map((year) => (
                                <option key={year._id} value={year.year}>{year.year}</option>
                            ))}
                        </select>
                        {errors.year && <p className={editTfgStyles.form.error}>{errors.year}</p>}
                    </div>
                    {/* Grado */}
                    <div className={editTfgStyles.form.group}>
                        <label className={editTfgStyles.form.label}>Grado</label>
                        <select
                            name="degree"
                            value={formData.degree}
                            onChange={handleChange}
                            className={selectClassName(errors.degree)}
                        >
                            <option value="" disabled>Selecciona un grado</option>
                            {degrees.map((degree) => (
                                <option key={degree._id} value={degree.degree}>{degree.degree}</option>
                            ))}
                        </select>
                        {errors.degree && <p className={editTfgStyles.form.error}>{errors.degree}</p>}
                    </div>
                    {/* Tutor */}
                    <div className={editTfgStyles.form.group} ref={advisorRef}>
                        <label className={editTfgStyles.form.label}>Tutor</label>
                        <div className="relative">
                            <div
                                onClick={() => setShowDropdown(!showDropdown)}
                                className={selectClassName(errors.advisor)}
                            >
                                <span>{formData.advisor || "Selecciona un tutor"}</span>
                                <svg className={`w-5 h-5 transform absolute right-2 top-1/2 -translate-y-1/2 ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        {errors.advisor && <p className={editTfgStyles.form.error}>{errors.advisor}</p>}
                    </div>
                    {/* Alumno */}
                    <div className={editTfgStyles.form.group}>
                        <label className={editTfgStyles.form.label}>Alumno</label>
                        <input
                            type="text"
                            name="student"
                            value={formData.student}
                            onChange={handleChange}
                            className={inputClassName(errors.student)}
                            placeholder="Nombre del alumno"
                        />
                        {errors.student && <p className={editTfgStyles.form.error}>{errors.student}</p>}
                    </div>
                    {/* Subida de archivo */}
                    <div className={editTfgStyles.form.group}>
                        <label className={editTfgStyles.form.label}>Archivo PDF</label>
                        <div className="flex">
                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                accept=".pdf"
                                className={inputClassName(errors.file)}
                            />
                        </div>
                        {errors.file && <p className={editTfgStyles.form.error}>{errors.file}</p>}
                        {formData.file && (
                            <p className="text-sm text-gray-600 mt-1">
                                Archivo seleccionado: {formData.file.name}
                            </p>
                        )}
                    </div>
                    {/* Palabras clave */}
                    <div className={editTfgStyles.keywords.container}>
                        <label className={editTfgStyles.form.label}>Palabras clave</label>
                        <div className={editTfgStyles.keywords.inputContainer}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                                placeholder="Añadir palabra clave..."
                                className={errors.keywords ?
                                    `${editTfgStyles.keywords.input} border-red-500` :
                                    editTfgStyles.keywords.input}
                            />
                            <button
                                type="button"
                                onClick={handleAddKeyword}
                                className={editTfgStyles.keywords.addButton}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Añadir
                            </button>
                        </div>
                        {errors.keywords && <p className={editTfgStyles.form.error}>{errors.keywords}</p>}
                        <div className={editTfgStyles.keywords.list}>
                            {formData.keywords.map((keyword, index) => (
                                <div key={index} className={editTfgStyles.keywords.tag}>
                                    <span>{keyword}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveKeyword(index)}
                                        className={editTfgStyles.keywords.removeButton}
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
                    <div className={editTfgStyles.modal.overlay}>
                        <div className={editTfgStyles.modal.container}>
                            <h3 className={editTfgStyles.modal.message}>¿Estás seguro de crear este TFG?</h3>
                            <div className={editTfgStyles.modal.buttonsContainer}>
                                <button
                                    onClick={() => handleConfirmSubmit(true)}
                                    className={editTfgStyles.modal.confirmButton}
                                >
                                    Sí
                                </button>
                                <button
                                    onClick={() => handleConfirmSubmit(false)}
                                    className={editTfgStyles.modal.cancelButton}
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

export default function UploadTFG() {
    return (
        <ErrorBoundary>
            <UploadTFGContent />
        </ErrorBoundary>
    );
}