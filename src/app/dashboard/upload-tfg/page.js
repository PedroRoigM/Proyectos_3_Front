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
import { ErrorBoundary } from '../../components/errors/error-boundary';
import { useNotification } from '../../components/errors/notification-context';
import { useApiError } from '../../components/errors/api-error-hook';
import {
    ErrorTypes,
    useFormErrors,
    useFormStatus,
    FormStatusMessage,
    FormFieldError
} from '../../components/errors/enhanced-error-handler';
import { validateTFGForm } from '../../components/errors/FormValidation';

function UploadTFGContent() {
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

    // Usar los nuevos hooks para el manejo de errores
    const [errors, setError, clearError, clearAllErrors] = useFormErrors({});
    const [formStatus, setFormStatus, clearFormStatus] = useFormStatus();
    const { loading: apiLoading, executeRequest } = useApiError();
    const { showSuccess, showError } = useNotification();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ejecutar solicitudes a la API en paralelo
                const [advisorsData, yearsData, degreesData] = await Promise.all([
                    executeRequest(
                        async () => await GetAdvisors({ active: true }),
                        {
                            errorMessage: 'No se pudieron cargar los tutores',
                            showLoadingState: false
                        }
                    ),
                    executeRequest(
                        async () => await GetYears({ active: true }),
                        {
                            errorMessage: 'No se pudieron cargar los años académicos',
                            showLoadingState: false
                        }
                    ),
                    executeRequest(
                        async () => await GetDegrees({ active: true }),
                        {
                            errorMessage: 'No se pudieron cargar los grados',
                            showLoadingState: false
                        }
                    )
                ]);

                setAdvisors(advisorsData || []);
                setYears(yearsData || []);
                setDegrees(degreesData || []);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setFormStatus("No se pudieron cargar los datos necesarios. Por favor, intenta más tarde.", ErrorTypes.ERROR);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [executeRequest, setFormStatus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar error específico del campo
        clearError(name);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                file
            });
            clearError('file');
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
            clearError('keywords');
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
        clearAllErrors();
        clearFormStatus();

        // Validar formulario
        const validationErrors = validateTFGForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            // Agregar cada error de validación al estado
            Object.entries(validationErrors).forEach(([field, message]) => {
                setError(field, message);
            });
            return;
        }

        // Mostrar diálogo de confirmación
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = async (confirm) => {
        if (!confirm) {
            setShowConfirmation(false);
            return;
        }

        setShowConfirmation(false);
        setIsSubmitting(true);
        clearAllErrors();
        clearFormStatus();

        try {
            // Paso 1: Crear el TFG sin el archivo
            const { file, ...dataWithoutFile } = formData;
            const response = await executeRequest(
                async () => await PostTFG(dataWithoutFile),
                {
                    loadingMessage: 'Creando proyecto TFG...',
                    errorMessage: 'Error al crear el proyecto TFG'
                }
            );

            if (!response) {
                setFormStatus('No se pudo crear el proyecto TFG', ErrorTypes.ERROR);
                setIsSubmitting(false);
                return;
            }

            // Paso 2: Subir el archivo PDF
            const fileResponse = await executeRequest(
                async () => await PatchTfgFile(response._id, file),
                {
                    loadingMessage: 'Subiendo archivo PDF...',
                    errorMessage: 'Error al subir el archivo PDF'
                }
            );

            if (!fileResponse) {
                setFormStatus('Se creó el proyecto pero hubo un problema al subir el archivo', ErrorTypes.WARNING);
                // Aún así, redirigir al dashboard después de un breve retraso
                setTimeout(() => router.push('/dashboard'), 3000);
                return;
            }

            // Éxito: mostrar mensaje y redirigir
            showSuccess('Proyecto TFG creado correctamente');
            router.push('/dashboard');

        } catch (error) {
            console.error('Error en el proceso de subida:', error);
            setFormStatus('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.', ErrorTypes.ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="Cargando formulario..." />;
    }

    return (
        <div className={uploadTfgStyles.layout.container}>
            <div className={uploadTfgStyles.layout.formContainer}>
                <h1 className={uploadTfgStyles.headings.title}>Subir TFG</h1>

                <FormStatusMessage
                    status={formStatus}
                    onDismiss={clearFormStatus}
                />

                {isSubmitting ? (
                    <div className="py-10">
                        <LoadingSpinner message="Subiendo TFG, por favor espera..." />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={uploadTfgStyles.form.container}>
                        <div>
                            <label className={uploadTfgStyles.form.label}>Año</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className={selectClassName(errors.year)}
                                disabled={apiLoading}
                            >
                                <option value="">Selecciona un año</option>
                                {years.map(year => (
                                    <option key={year._id} value={year.year}>{year.year}</option>
                                ))}
                            </select>
                            <FormFieldError error={errors.year} />
                        </div>

                        <div>
                            <label className={uploadTfgStyles.form.label}>Grado</label>
                            <select
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                className={selectClassName(errors.degree)}
                                disabled={apiLoading}
                            >
                                <option value="">Selecciona un Grado</option>
                                {degrees.map(degree => (
                                    <option key={degree._id} value={degree.degree}>
                                        {degree.degree}
                                    </option>
                                ))}
                            </select>
                            <FormFieldError error={errors.degree} />
                        </div>

                        <div>
                            <label className={uploadTfgStyles.form.label}>Estudiante</label>
                            <input
                                type="text"
                                name="student"
                                value={formData.student}
                                onChange={handleChange}
                                className={inputClassName(errors.student)}
                                disabled={apiLoading}
                            />
                            <FormFieldError error={errors.student} />
                        </div>

                        <div>
                            <label className={uploadTfgStyles.form.label}>Tutor</label>
                            <select
                                name="advisor"
                                value={formData.advisor}
                                onChange={handleChange}
                                className={selectClassName(errors.advisor)}
                                disabled={apiLoading}
                            >
                                <option value="">Selecciona tu Tutor</option>
                                {advisors.map(advisor => (
                                    <option key={advisor._id} value={advisor.advisor}>
                                        {advisor.advisor}
                                    </option>
                                ))}
                            </select>
                            <FormFieldError error={errors.advisor} />
                        </div>

                        <div>
                            <label className={uploadTfgStyles.form.label}>Título</label>
                            <input
                                type="text"
                                name="tfgTitle"
                                value={formData.tfgTitle}
                                onChange={handleChange}
                                className={inputClassName(errors.tfgTitle)}
                                disabled={apiLoading}
                            />
                            <FormFieldError error={errors.tfgTitle} />
                        </div>

                        <div>
                            <label className={uploadTfgStyles.form.label}>Resumen</label>
                            <textarea
                                name="abstract"
                                value={formData.abstract}
                                onChange={handleChange}
                                className={textareaClassName(errors.abstract)}
                                disabled={apiLoading}
                            ></textarea>
                            <FormFieldError error={errors.abstract} />
                        </div>

                        <div>
                            <label className={uploadTfgStyles.form.label}>Archivo</label>
                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                className={inputClassName(errors.file)}
                                accept=".pdf"
                                disabled={apiLoading}
                            />
                            <FormFieldError error={errors.file} />
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
                                    className={errors.keywords
                                        ? `${uploadTfgStyles.form.keywordInput.input} ${uploadTfgStyles.form.input.error}`
                                        : `${uploadTfgStyles.form.keywordInput.input} ${uploadTfgStyles.form.input.valid}`
                                    }
                                    placeholder="Añadir palabra clave..."
                                    disabled={apiLoading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddKeyword}
                                    className={uploadTfgStyles.form.keywordInput.button}
                                    disabled={apiLoading}
                                >
                                    +
                                </button>
                            </div>
                            <FormFieldError error={errors.keywords} />
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
                                            disabled={apiLoading}
                                        >
                                            ❌
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            type="submit"
                            className={uploadTfgStyles.buttons.primary}
                            disabled={apiLoading}
                        >
                            {apiLoading ? 'Procesando...' : 'Enviar'}
                        </button>
                    </form>
                )}

                {/* Diálogo de confirmación */}
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
                                    disabled={apiLoading}
                                >
                                    Sí
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleConfirmSubmit(false)}
                                    className={uploadTfgStyles.modal.cancelButton}
                                    disabled={apiLoading}
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