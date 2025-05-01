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

    // Almacenar todos los datos completos
    const [advisorsData, setAdvisorsData] = useState([]);
    const [yearsData, setYearsData] = useState([]);
    const [degreesData, setDegreesData] = useState([]);

    // Listas para los selects
    const [advisors, setAdvisors] = useState([]);
    const [years, setYears] = useState([]);
    const [degrees, setDegrees] = useState([]);

    const [inputValue, setInputValue] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Estado para prevenir múltiples envíos
    const [buttonState, setButtonState] = useState({
        clicked: false,
        lastClickTime: 0
    });

    // Usar los hooks para el manejo de errores
    const [errors, setError, clearError, clearAllErrors] = useFormErrors({});
    const [formStatus, setFormStatus, clearFormStatus] = useFormStatus();
    const { loading: apiLoading, executeRequest } = useApiError();
    const { showSuccess, showError } = useNotification();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tfgCreated, setTfgCreated] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ejecutar solicitudes a la API en paralelo
                const [advisorsResult, yearsResult, degreesResult] = await Promise.all([
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

                // Guardar los datos completos
                setAdvisorsData(advisorsResult || []);
                setYearsData(yearsResult || []);
                setDegreesData(degreesResult || []);

                // Preparar listas para los selects
                setAdvisors(advisorsResult || []);
                setYears(yearsResult || []);
                setDegrees(degreesResult || []);

                console.log("Datos cargados:", {
                    advisors: advisorsResult?.length || 0,
                    years: yearsResult?.length || 0,
                    degrees: degreesResult?.length || 0
                });
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

        // Prevenir envíos rápidos múltiples (debounce)
        if (isSubmitting || apiLoading) {
            console.log("Solicitud ya en proceso, ignorando clic adicional");
            return;
        }

        // Si ya fue clicado recientemente (últimos 2 segundos), prevenir clic adicional
        const now = Date.now();
        if (buttonState.clicked && now - buttonState.lastClickTime < 2000) {
            console.log("Múltiples clics detectados, ignorando");
            return;
        }

        // Actualizar estado de botón
        setButtonState({
            clicked: true,
            lastClickTime: now
        });

        clearAllErrors();
        clearFormStatus();

        // Validar formulario
        const validationErrors = validateTFGForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            // Agregar cada error de validación al estado
            Object.entries(validationErrors).forEach(([field, message]) => {
                setError(field, message);
            });

            // Restaurar estado del botón
            setTimeout(() => {
                setButtonState({
                    clicked: false,
                    lastClickTime: 0
                });
            }, 1000);

            return;
        }

        // Mostrar diálogo de confirmación
        setShowConfirmation(true);

        // Restaurar estado del botón después de 3 segundos
        setTimeout(() => {
            setButtonState({
                clicked: false,
                lastClickTime: 0
            });
        }, 3000);
    };

    const handleConfirmSubmit = async (confirm) => {
        if (!confirm) {
            setShowConfirmation(false);
            return;
        }

        // Si ya está enviando, ignorar
        if (isSubmitting) {
            console.log("Envío ya en proceso, ignorando solicitud duplicada");
            return;
        }

        setShowConfirmation(false);
        setIsSubmitting(true);
        clearAllErrors();
        clearFormStatus();

        try {
            // Añadir ID único para seguimiento en logs
            const requestId = `tfg-${Date.now()}`;
            console.log(`[${requestId}] Iniciando envío de TFG`);

            // Preparar datos para enviar al servidor
            const { file, ...dataWithoutFile } = formData;

            // Encontrar los objetos completos de year, degree y advisor
            const selectedYear = yearsData.find(y => y.year === formData.year);
            const selectedDegree = degreesData.find(d => d.degree === formData.degree);
            const selectedAdvisor = advisorsData.find(a => a.advisor === formData.advisor);

            // Verificar que se encontraron todos los datos necesarios
            if (!selectedYear || !selectedDegree || !selectedAdvisor) {
                console.error("No se pudieron encontrar todos los datos necesarios:", {
                    yearFound: !!selectedYear,
                    degreeFound: !!selectedDegree,
                    advisorFound: !!selectedAdvisor
                });
                setFormStatus("Error en los datos seleccionados. Por favor, verifica tu selección.", ErrorTypes.ERROR);
                setIsSubmitting(false);
                return;
            }

            // Crear objeto de datos con formato correcto
            const formattedData = {
                ...dataWithoutFile,
                year: selectedYear._id,
                degree: selectedDegree._id,
                advisor: selectedAdvisor._id,
            };

            console.log(`[${requestId}] Datos preparados:`, formattedData);

            // Paso 1: Crear el TFG sin el archivo
            const response = await executeRequest(
                async () => await PostTFG(formattedData),
                {
                    loadingMessage: 'Creando proyecto TFG...',
                    errorMessage: 'Error al crear el proyecto TFG'
                }
            );

            if (!response || response.error) {
                console.log(`[${requestId}] Error en creación de TFG:`, response);
                setFormStatus(response?.message || 'No se pudo crear el proyecto TFG', ErrorTypes.ERROR);
                setIsSubmitting(false);
                return;
            }

            // Guardar el TFG creado
            setTfgCreated(response);

            // Paso 2: Subir el archivo PDF - ahora con redirección automática
            console.log(`[${requestId}] TFG creado con éxito, ID:`, response._id);

            // Mostrar mensaje de éxito y notificar que se está procesando el archivo
            setFormStatus('TFG creado correctamente. Subiendo archivo y redirigiendo...', ErrorTypes.SUCCESS);

            // Intentar subir el archivo - esta función ahora redirigirá automáticamente
            const fileUploadResult = await PatchTfgFile(response._id, file);

            // Si llegamos aquí, es que hubo un error en la subida del archivo
            // ya que la función debería redirigir en caso de éxito
            if (fileUploadResult && fileUploadResult.fileError) {
                setFormStatus(`Error al subir el archivo: ${fileUploadResult.fileError}`, ErrorTypes.ERROR);
            } else {
                // Por si acaso, mostrar un error genérico
                setFormStatus('Ocurrió un error inesperado al subir el archivo', ErrorTypes.ERROR);
            }

        } catch (error) {
            // Este bloque solo se ejecutará si hay un error no controlado
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
                                rows={5}
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
                            className={`${uploadTfgStyles.buttons.primary} ${isSubmitting || apiLoading || buttonState.clicked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting || apiLoading || buttonState.clicked}
                        >
                            {isSubmitting || apiLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </span>
                            ) : 'Enviar'}
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
                                    onClick={() => {
                                        if (apiLoading || isSubmitting) {
                                            console.log("Procesamiento en curso, ignorando clic adicional");
                                            return;
                                        }
                                        handleConfirmSubmit(true);
                                    }}
                                    className={`${uploadTfgStyles.modal.confirmButton} ${apiLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={apiLoading || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : 'Sí'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleConfirmSubmit(false)}
                                    className={uploadTfgStyles.modal.cancelButton}
                                    disabled={apiLoading || isSubmitting}
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