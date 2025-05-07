'use client';
import PutTFG from '../../../../components/lib/PutTFG';
import PatchTfgFile from '../../../../components/lib/PatchTfgFile';
import GetTFG from '../../../../components/lib/GetTFG';
import GetAdvisors from '../../../../components/lib/GetAdvisors';
import GetDegrees from '../../../../components/lib/GetDegrees';
import GetYears from '../../../../components/lib/GetYears';
import GetTFGpdf from '../../../../components/lib/GetTFGpdf';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { styles } from '../../../components/styles/components';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [loading, setLoading] = useState(true); // Estado de carga
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


    useEffect(() => {
        const fetchData = async () => {
            try {
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

                setLoading(false); // Finaliza la carga
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

        setErrors({ ...errors, [name]: "" }); // Limpiar errores al cambiar el valor
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

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            // Preparamos los datos para enviar al backend, usando los IDs en lugar de los valores
            const dataToSend = {
                ...formData,
                advisor: formData.advisorId, // Enviar el ID en lugar del valor
                year: formData.yearId,       // Enviar el ID en lugar del valor
                degree: formData.degreeId    // Enviar el ID en lugar del valor
            };

            console.log("Datos a enviar:", dataToSend);
            const response = await PutTFG(id, dataToSend);
            console.log(response);

            // Si se ha actualizado el PDF, enviar el archivo

            const responseFile = await PatchTfgFile(id, formData.file);
            if (!responseFile) {
                setErrors({ general: '❌ Error al actualizar el archivo, intenta de nuevo.' });
                return;
            }
            setErrors({ general: "✅ TFG actualizado correctamente." });
        } catch (error) {
            console.error("Error al actualizar:", error);
            setErrors({ general: '❌ Ha ocurrido un error, intenta de nuevo.' });
        }
    };


    return (
        <div className={styles.edit.container}>
            {loading ? (
                <LoadingSpinner message="Cargando formulario..." />
            ) : formData ? (

                < div className={styles.edit.form.container}>
                    <h1 className={styles.edit.form.title}>Actualizar TFG</h1>
                    <form className={styles.edit.form.space}>
                        {/* Título */}
                        <div>
                            <label className={styles.edit.form.subtitle}>Título</label>
                            <input
                                type="text"
                                name="tfgTitle"
                                value={formData.tfgTitle}
                                onChange={handleChange}
                                className={styles.edit.form.input}
                            />
                        </div>
                        {/* Resumen */}
                        <label className={styles.edit.form.subtitle}>Resumen</label>
                        <textarea
                            name="abstract"
                            value={formData.abstract}
                            onChange={handleChange}
                            className={styles.edit.form.input}
                        />

                        {/* Año */}
                        <div>
                            <label className={styles.edit.form.subtitle}>Año</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className={styles.edit.form.input}
                            >
                                <option value="" disabled>Selecciona un año</option>
                                {years.map((year) => (
                                    <option key={year._id} value={year.year}>{year.year}</option>
                                ))}
                            </select>
                            {errors.year && <p className={styles.edit.form.error}>{errors.year}</p>}
                        </div>

                        {/* Grado */}
                        <div>
                            <label className={styles.edit.form.subtitle}>Grado</label>
                            <select
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                className={styles.edit.form.input}
                            >
                                <option value="" disabled>Selecciona un grado</option>
                                {degrees.map((degree) => (
                                    <option key={degree._id} value={degree.degree}>{degree.degree}</option>
                                ))}
                            </select>
                            {errors.degree && <p className={styles.edit.form.error}>{errors.degree}</p>}
                        </div>

                        {/* Asesor */}
                        <div>
                            <label className={styles.edit.form.subtitle}>Asesor</label>
                            <select
                                name="advisor"
                                value={formData.advisor}
                                onChange={handleChange}
                                className={styles.edit.form.input}
                            >
                                <option value="" disabled>Selecciona un asesor</option>
                                {advisors.map((advisor) => (
                                    <option key={advisor._id} value={advisor.advisor}>{advisor.advisor}</option>
                                ))}
                            </select>
                            {errors.advisor && <p className={styles.edit.form.error}>{errors.advisor}</p>}
                        </div>

                        {/* Alumno */}
                        <div>
                            <label className={styles.edit.form.subtitle}>Alumno</label>
                            <input
                                type="text"
                                name="student"
                                value={formData.student}
                                onChange={handleChange}
                                className={styles.edit.form.input}
                            />
                            {errors.student && <p className={styles.edit.form.error}>{errors.student}</p>}
                        </div>

                        {/*Archivo*/}
                        <div>
                            <label className={styles.edit.form.subtitle}>Archivo</label>
                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                className={`${styles.edit.file.button} ${errors.file ? styles.edit.file.error : styles.edit.file.normal}`}
                                accept=".pdf"
                            />
                            {formData.file && (
                                <span className={styles.edit.file.text}>
                                    {typeof formData.file === 'string' ? formData.file : formData.file.name}
                                </span>
                            )}
                            {errors.file && <p className={styles.edit.form.error}>{errors.file}</p>}
                        </div>

                        {/*Palabras clave*/}
                        <label className={styles.edit.form.subtitle}>Palabras clave</label>
                        <div className={styles.edit.keywords.container}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className={styles.edit.form.input}
                                placeholder="Añadir palabra clave..."
                            />
                            <button
                                type="button"
                                onClick={handleAddKeyword}
                                className={styles.edit.keywords.addbutton}
                            >
                                +
                            </button>
                        </div>

                        {/* Lista de palabras clave */}
                        {formData.keywords.map((keyword, index) => (
                            <li key={index} className={styles.edit.keywords.list}>
                                <span>{keyword}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveKeyword(index)}
                                >
                                    ❌
                                </button>
                            </li>
                        ))}

                        {errors.keywords && <p className={styles.edit.form.error}>{errors.keywords}</p>}
                        {errors.general && <p className={errors.general.includes("✅") ? styles.edit.form.success : styles.edit.form.error}>{errors.general}</p>}

                        {/* Botón */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={styles.edit.button}
                        >
                            Actualizar
                        </button>
                    </form>
                    {showConfirmation && (
                        <div className={styles.edit.confirmation.flex}>
                            <div className={styles.edit.confirmation.container}>
                                <p className={styles.edit.confirmation.text}>¿Estás seguro de actualizar el TFG?</p>
                                <div className={styles.edit.confirmation.button.button_flex}>
                                    <button
                                        type="button"
                                        onClick={() => handleConfirmSubmit(true)}
                                        className={styles.edit.confirmation.button.button_yes}
                                    >
                                        Sí
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleConfirmSubmit(false)}
                                        className={styles.edit.confirmation.button.button_no}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )
                :
                (
                    <div className={styles.specific_tfg.id.notfound}>
                        <h2>No se encontró el TFG</h2>
                    </div>
                )
            }
        </div >
    );
}