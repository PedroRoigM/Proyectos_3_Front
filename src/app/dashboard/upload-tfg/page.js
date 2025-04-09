'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostTFG from '../components/lib/PostTFG';
import PatchTfgFile from '../components/lib/PatchTfgFile';
import GetAdvisors from '../components/lib/GetAdvisors';
import GetDegrees from '../components/lib/GetDegrees';
import GetYears from '../components/lib/GetYears';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
    uploadTfgStyles, 
    inputClassName, 
    selectClassName, 
    textareaClassName 
} from '../components/styles/upload-tfg';

export default function Page() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        year: '',
        degree: '',
        student: '',
        advisor: '',
        keywords: [],
        tfgTitle: '',
        abstract: '',
        file: null,
    });
    const [advisors, setAdvisors] = useState([]);
    const [years, setYears] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [advisorsData, yearsData, degreesData] = await Promise.all([
                    GetAdvisors(),
                    GetYears(),
                    GetDegrees()
                ]);

                setAdvisors(advisorsData || []);
                setYears(yearsData || []);
                setDegrees(degreesData || []);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setErrors({ general: "No se pudieron cargar los datos necesarios. Por favor, intenta más tarde." });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors({
            ...errors,
            [name]: null
        });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = async (confirm) => {
        setShowConfirmation(false);
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
        if (formData.keywords.length < 3) validationErrors.keywords = 'Añade al menos 3 palabras claves.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const { file, ...dataWithoutFile } = formData;
            const response = await PostTFG(dataWithoutFile);
            if (response.error) {
                setErrors({ general: response.error });
                setLoading(false);
                return;
            }

            const response_file = await PatchTfgFile(response._id, file);
            if (response_file.error) {
                setErrors({ general: response_file.error });
                setLoading(false);
                return;
            }
            router.push('/dashboard');
        } catch {
            setErrors({ file: '❌ Ha ocurrido un error, intenta de nuevo.' });
        }
        setLoading(false);
    };

    if (isLoading) {
        return <LoadingSpinner message="Cargando formulario..." />;
    }

    return (
        <div className={uploadTfgStyles.layout.container}>
            <div className={uploadTfgStyles.layout.formContainer}>
                <h1 className={uploadTfgStyles.headings.title}>Subir TFG</h1>

                {isSubmitting ? (
                    <div className="py-10">
                        <LoadingSpinner message="Subiendo TFG, por favor espera..." />
                    </div>
                ) : (
                    <>
                        {errors.general && (
                            <div className={errors.general.includes('✅') ? 
                                uploadTfgStyles.feedback.success : 
                                uploadTfgStyles.feedback.error}>
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={uploadTfgStyles.form.container}>
                            <div>
                                <label className={uploadTfgStyles.form.label}>Año</label>
                                <select 
                                    name="year" 
                                    value={formData.year} 
                                    onChange={handleChange} 
                                    className={selectClassName(errors.year)}
                                >
                                    <option value="">Selecciona un año</option>
                                    {years.map(year => <option key={year._id} value={year.year}>{year.year}</option>)}
                                </select>
                                {errors.year && <p className={uploadTfgStyles.form.error}>{errors.year}</p>}
                            </div>

                            <div>
                                <label className={uploadTfgStyles.form.label}>Grado</label>
                                <select 
                                    name="degree" 
                                    value={formData.degree} 
                                    onChange={handleChange} 
                                    className={selectClassName(errors.degree)}
                                >
                                    <option value="">Selecciona un Grado</option>
                                    {degrees.map(degree => <option key={degree._id} value={degree.degree}>{degree.degree}</option>)}
                                </select>
                                {errors.degree && <p className={uploadTfgStyles.form.error}>{errors.degree}</p>}
                            </div>

                            <div>
                                <label className={uploadTfgStyles.form.label}>Estudiante</label>
                                <input 
                                    type="text" 
                                    name="student" 
                                    value={formData.student} 
                                    onChange={handleChange} 
                                    className={inputClassName(errors.student)} 
                                />
                                {errors.student && <p className={uploadTfgStyles.form.error}>{errors.student}</p>}
                            </div>

                            <div>
                                <label className={uploadTfgStyles.form.label}>Tutor</label>
                                <select 
                                    name="advisor" 
                                    value={formData.advisor} 
                                    onChange={handleChange} 
                                    className={selectClassName(errors.advisor)}
                                >
                                    <option value="">Selecciona tu Tutor</option>
                                    {advisors.map(advisor => <option key={advisor._id} value={advisor.advisor}>{advisor.advisor}</option>)}
                                </select>
                                {errors.advisor && <p className={uploadTfgStyles.form.error}>{errors.advisor}</p>}
                            </div>

                            <div>
                                <label className={uploadTfgStyles.form.label}>Título</label>
                                <input 
                                    type="text" 
                                    name="tfgTitle" 
                                    value={formData.tfgTitle} 
                                    onChange={handleChange} 
                                    className={inputClassName(errors.tfgTitle)} 
                                />
                                {errors.tfgTitle && <p className={uploadTfgStyles.form.error}>{errors.tfgTitle}</p>}
                            </div>

                            <div>
                                <label className={uploadTfgStyles.form.label}>Resumen</label>
                                <textarea 
                                    name="abstract" 
                                    value={formData.abstract} 
                                    onChange={handleChange} 
                                    className={textareaClassName(errors.abstract)}
                                ></textarea>
                                {errors.abstract && <p className={uploadTfgStyles.form.error}>{errors.abstract}</p>}
                            </div>

                            <div>
                                <label className={uploadTfgStyles.form.label}>Archivo</label>
                                <input 
                                    type="file" 
                                    name="file" 
                                    onChange={handleFileChange} 
                                    className={inputClassName(errors.file)} 
                                    accept=".pdf" 
                                />
                                {errors.file && <p className={uploadTfgStyles.form.error}>{errors.file}</p>}
                            </div>

                            {/* Palabras clave */}
                            <div>
                                <label className={uploadTfgStyles.form.label}>Palabras clave</label>
                                <div className={uploadTfgStyles.form.keywordInput.container}>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                                        className={errors.keywords ? 
                                            `${uploadTfgStyles.form.keywordInput.input} ${uploadTfgStyles.form.input.error}` : 
                                            `${uploadTfgStyles.form.keywordInput.input} ${uploadTfgStyles.form.input.valid}`}
                                        placeholder="Añadir palabra clave..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddKeyword}
                                        className={uploadTfgStyles.form.keywordInput.button}
                                    >
                                        +
                                    </button>
                                </div>
                                {errors.keywords && <p className={uploadTfgStyles.form.error}>{errors.keywords}</p>}
                            </div>

                            {/* Lista de palabras clave */}
                            {formData.keywords.length > 0 && (
                                <ul className={uploadTfgStyles.form.keywordList.container}>
                                    {formData.keywords.map((keyword, index) => (
                                        <li key={index} className={uploadTfgStyles.form.keywordList.item}>
                                            <span className={uploadTfgStyles.form.keywordList.text}>{keyword}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveKeyword(index)} 
                                                className={uploadTfgStyles.form.keywordList.removeButton}
                                            >
                                                ❌
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <button type="submit" className={uploadTfgStyles.buttons.primary}>Enviar</button>
                        </form>

                        {/* Cuadro de confirmación */}
                        {showConfirmation && (
                            <div className={uploadTfgStyles.modal.overlay}>
                                <div className={uploadTfgStyles.modal.container}>
                                    <p className={uploadTfgStyles.modal.message}>
                                        ¿Estás seguro de que quieres enviar el TFG? <br /> 
                                        El TFG pasará a pertenecer a la universidad y solo se podrá editar contactando con coordinación.
                                    </p>
                                    <div className={uploadTfgStyles.modal.buttonsContainer}>
                                        <button
                                            type="button"
                                            onClick={() => handleConfirmSubmit(true)}
                                            className={uploadTfgStyles.modal.confirmButton}
                                        >
                                            Sí
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleConfirmSubmit(false)}
                                            className={uploadTfgStyles.modal.cancelButton}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}