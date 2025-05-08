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
import { editTfgStyles, inputClassName, selectClassName, classNames } from '../../../components/styles/edit-tfg';

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

    // Cerrar dropdown al hacer clic fuera o al hacer scroll
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
        <div className={editTfgStyles.layout.container}>
            <div className={editTfgStyles.layout.formContainer}>
                {/* Cabecera con título y botones de acción */}
                <div className={editTfgStyles.header.container}>
                    <h2 className={editTfgStyles.header.title}>{formData.tfgTitle}</h2>
                    <div className={editTfgStyles.header.actionsContainer}>
                        <button
                            onClick={handleSubmit}
                            className={editTfgStyles.header.editButton}
                        >
                            Guardar
                        </button>
                        <button
                            onClick={downloadPDF}
                            className={editTfgStyles.header.secondaryButton}
                        >
                            Descargar
                        </button>
                        <Link
                            href={`/dashboard/admin/tfg/${id}?id=${id}`}
                            className={editTfgStyles.header.secondaryButton}
                        >
                            Ver TFG
                        </Link>
                    </div>
                </div>

                {/* Mensajes de error o éxito */}
                {(errors.general || successMessage) && (
                    <div className={successMessage ? editTfgStyles.feedback.success : editTfgStyles.feedback.error}>
                        {errors.general || successMessage}
                    </div>
                )}

                {/* Contenedor del resumen */}
                <div className={editTfgStyles.abstract.container}>
                    <textarea
                        name="abstract"
                        value={formData.abstract}
                        onChange={handleChange}
                        className={editTfgStyles.abstract.textarea}
                        rows="5"
                    />
                    {errors.abstract && <p className={editTfgStyles.form.error}>{errors.abstract}</p>}
                </div>




                {/* Campos adicionales para editar */}
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
                        />
                        {errors.student && <p className={editTfgStyles.form.error}>{errors.student}</p>}
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
                {/* Sección del PDF */}
                <div className={editTfgStyles.pdf.container}>
                    <h2 className={editTfgStyles.pdf.title}>Documento TFG</h2>

                    {/* Formulario para cambiar el archivo */}
                    <div className={editTfgStyles.pdf.uploadContainer}>
                        <div className={editTfgStyles.pdf.uploadInfo}>
                            <div className={editTfgStyles.pdf.fileInfo}>
                                {typeof formData.file === 'string' ?
                                    'Archivo PDF actual del TFG' :
                                    formData.file ? formData.file.name : 'No se ha seleccionado un archivo'
                                }
                            </div>
                            <label className={editTfgStyles.pdf.uploadButton}>
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
                        {errors.file && <p className={editTfgStyles.form.error}>{errors.file}</p>}
                    </div>
                    {/* Visualizador de PDF */}
                    {formData.file && (
                        <div>
                            <div className={editTfgStyles.pdf.viewerContainer}
                                ref={pdfContainerRef}
                                onContextMenu={handleContextMenu}>

                                {/* Marca de agua */}
                                <div className={editTfgStyles.pdf.watermark}>
                                    <div className={editTfgStyles.pdf.watermarkText}>
                                        SOLO VISUALIZACIÓN
                                    </div>
                                </div>

                                {/* Visualizador de PDF */}
                                <div className="w-full h-full overflow-hidden">
                                    <object
                                        data={`data:application/pdf;base64,${Buffer.from(formData.file).toString('base64')}`}
                                        type="application/pdf"
                                        className={editTfgStyles.pdf.pdfObject}
                                    >
                                        <p className={editTfgStyles.pdf.fallbackMessage}>Tu navegador no puede mostrar PDFs.</p>
                                    </object>
                                </div>

                                {/* Capa superior para bloquear interacciones */}
                                <div className={editTfgStyles.pdf.protectionOverlay}></div>
                            </div>

                            <div className={editTfgStyles.pdf.disclaimer}>
                                Este documento está protegido. Visualización solo con fines académicos.
                            </div>
                        </div>
                    )}
                </div>
                {/* Modal de confirmación */}
                {showConfirmation && (
                    <div className={editTfgStyles.modal.overlay}>
                        <div className={editTfgStyles.modal.container}>
                            <h3 className={editTfgStyles.modal.message}>¿Estás seguro de actualizar el TFG?</h3>
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