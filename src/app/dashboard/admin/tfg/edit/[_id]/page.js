'use client';
import PutTFG from '../../../../components/lib/PutTFG';
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
                    title: tfgRes.tfgTitle,
                    abstract: tfgRes.abstract,
                    advisor: tfgRes.advisor,
                    student: tfgRes.student,
                    keywords: tfgRes.keywords,
                    year: tfgRes.year,
                    degree: tfgRes.degree,
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
        setFormData({ ...formData, [name]: value });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = async () => {

        if (!confirm) {
            setShowConfirmation(false);
            return;
        }
        setShowConfirmation(false);


        const validationErrors = {};
        if (!formData.year) validationErrors.year = 'El año es obligatorio.';
        if (!formData.degree) validationErrors.degree = 'El grado es obligatorio.';
        if (!formData.student) validationErrors.student = 'El nombre del estudiante es obligatorio.';
        if (!formData.advisor) validationErrors.advisor = 'El tutor es obligatorio.';
        if (!formData.tfgTitle) validationErrors.tfgTitle = 'El título del TFG es obligatorio.';
        if (!formData.abstract) validationErrors.abstract = 'El resumen es obligatorio.';
        if (!formData.file) validationErrors.file = 'El archivo es obligatorio.';
        if (formData.keywords.length < 3) validationErrors.keywords = 'Añade al menos 3 palabras claves.';
        console.log(Object.keys(validationErrors))
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        console.log("HANDLE SUBMIT")
        try {
            console.log("formData", formData);
            const response = await PutTFG(id, formData);
            console.log(response);
            setErrors({ general: "✅ TFG actualizado correctamente." });
        } catch {
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
                                name="title"
                                value={formData.title}
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
                                <option value="" disabled>{formData.year.year || "Selecciona un año"}</option>
                                {years.map((year) => (
                                    <option key={year._id} value={year.year}>{year.year}</option>
                                ))}
                                {errors.year && <p className={styles.edit.form.error}>{errors.year}</p>}
                            </select>
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
                                <option value="" disabled>{formData.degree.degree || "Selecciona un grado"}</option>
                                {degrees.map((degree) => (
                                    <option key={degree._id} value={degree.degree}>{degree.degree}</option>
                                ))}
                                {errors.degree && <p className={styles.edit.form.error}>{errors.degree}</p>}
                            </select>
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
                                <option value="" disabled>{formData.advisor.advisor || "Selecciona un asesor"}</option>
                                {advisors.map((advisor) => (
                                    <option key={advisor._id} value={advisor.advisor}>{advisor.advisor}</option>
                                ))}
                            </select>
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
