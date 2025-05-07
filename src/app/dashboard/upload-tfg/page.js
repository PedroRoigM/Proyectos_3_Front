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

    // Store the full data objects
    const [advisorsData, setAdvisorsData] = useState([]);
    const [yearsData, setYearsData] = useState([]);
    const [degreesData, setDegreesData] = useState([]);

    const [inputValue, setInputValue] = useState("");

    // Status flags
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hooks for error handling
    const [errors, setError, clearError, clearAllErrors] = useFormErrors({});
    const [formStatus, setFormStatus, clearFormStatus] = useFormStatus();
    const { loading: apiLoading, executeRequest } = useApiError();
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel
                let [advisorsResult, yearsResult, degreesResult] = await Promise.all([
                    GetAdvisors({ active: true }),
                    GetYears({ active: true }),
                    GetDegrees({ active: true })
                ]);

                console.log("Data received:", {
                    advisors: advisorsResult,
                    years: yearsResult,
                    degrees: degreesResult
                });

                // Make sure we have arrays
                if (!Array.isArray(advisorsResult)) advisorsResult = [];
                if (!Array.isArray(yearsResult)) yearsResult = [];
                if (!Array.isArray(degreesResult)) degreesResult = [];

                // Store the full data for later use
                setAdvisorsData(advisorsResult);
                setYearsData(yearsResult);
                setDegreesData(degreesResult);

                console.log("Data stored successfully");
            } catch (error) {
                console.error("Error loading data:", error);
                showError("Could not load required form data. Please refresh the page.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [showError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        clearError(name);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file
            }));
            clearError('file');
        }
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleAddKeyword = () => {
        if (inputValue.trim() !== "" && !formData.keywords.includes(inputValue.trim())) {
            setFormData(prev => ({
                ...prev,
                keywords: [...prev.keywords, inputValue.trim()]
            }));
            setInputValue("");
            clearError('keywords');
        }
    };

    const handleRemoveKeyword = (index) => {
        setFormData(prev => ({
            ...prev,
            keywords: prev.keywords.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if already in progress
        if (isSubmitting || apiLoading) {
            console.log("Submission already in progress");
            return;
        }

        // Clear previous errors
        clearAllErrors();
        clearFormStatus();

        // Set submission state
        setIsSubmitting(true);

        try {
            // Validate form
            const validationErrors = validateTFGForm(formData);
            if (Object.keys(validationErrors).length > 0) {
                // Add validation errors to state
                Object.entries(validationErrors).forEach(([field, message]) => {
                    setError(field, message);
                });
                return;
            }

            // Generate request ID for tracking
            const requestId = `tfg-${Date.now()}`;
            console.log(`[${requestId}] Starting TFG submission`);

            // Prepare data - separate file from rest of data
            const { file, ...dataWithoutFile } = formData;

            // Find the selected items in the data arrays
            const selectedYear = yearsData.find(y => y.year === formData.year);
            const selectedDegree = degreesData.find(d => d.degree === formData.degree);
            const selectedAdvisor = advisorsData.find(a => a.advisor === formData.advisor);

            console.log("Selected items:", {
                year: selectedYear,
                degree: selectedDegree,
                advisor: selectedAdvisor
            });

            // Check if all required data was found
            if (!selectedYear || !selectedDegree || !selectedAdvisor) {
                console.error("Missing or invalid selection data");
                setFormStatus("Please make sure all fields have valid selections", ErrorTypes.ERROR);
                return;
            }

            // Format data correctly
            const formattedData = {
                ...dataWithoutFile,
                year: selectedYear._id,
                degree: selectedDegree._id,
                advisor: selectedAdvisor._id,
            };

            console.log(`[${requestId}] Formatted data:`, formattedData);
            setFormStatus('Creating TFG...', ErrorTypes.INFO);

            // Step 1: Create TFG
            const tfgResponse = await PostTFG(formattedData);

            if (!tfgResponse || tfgResponse.error) {
                console.error(`[${requestId}] Error creating TFG:`, tfgResponse);
                setFormStatus(tfgResponse?.message || 'Could not create TFG project', ErrorTypes.ERROR);
                return;
            }

            console.log(`[${requestId}] TFG created successfully, ID:`, tfgResponse._id);
            setFormStatus('TFG created successfully. Uploading file...', ErrorTypes.SUCCESS);

            // Step 2: Upload PDF file (this will redirect automatically if successful)
            try {
                await PatchTfgFile(tfgResponse._id, file);

                // If we reach here, there was an error in file upload since it should redirect
                setFormStatus('Error uploading file. Please try again.', ErrorTypes.ERROR);
            } catch (uploadError) {
                // Check if it's a redirect (which is actually the expected behavior)
                if (uploadError.digest && uploadError.digest.startsWith('NEXT_REDIRECT')) {
                    // This is success! Let the redirect happen
                    throw uploadError;
                }

                // Otherwise it's a real error
                console.error(`[${requestId}] File upload error:`, uploadError);
                setFormStatus('Error uploading file. Please try again.', ErrorTypes.ERROR);
            }

        } catch (error) {
            // If this is a redirect, let it happen
            if (error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
                throw error;
            }

            console.error('Error in upload process:', error);
            setFormStatus('An unexpected error occurred. Please try again.', ErrorTypes.ERROR);
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
                                disabled={apiLoading || isSubmitting}
                            >
                                <option value="">Selecciona un año</option>
                                {yearsData.map(year => (
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
                                disabled={apiLoading || isSubmitting}
                            >
                                <option value="">Selecciona un grado</option>
                                {degreesData.map(degree => (
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
                                disabled={apiLoading || isSubmitting}
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
                                disabled={apiLoading || isSubmitting}
                            >
                                <option value="">Selecciona un tutor</option>
                                {advisorsData.map(advisor => (
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
                                disabled={apiLoading || isSubmitting}
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
                                disabled={apiLoading || isSubmitting}
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
                                disabled={apiLoading || isSubmitting}
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
                                    disabled={apiLoading || isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddKeyword}
                                    className={uploadTfgStyles.form.keywordInput.button}
                                    disabled={apiLoading || isSubmitting}
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
                                            disabled={apiLoading || isSubmitting}
                                        >
                                            ❌
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            type="submit"
                            className={`${uploadTfgStyles.buttons.primary} ${isSubmitting || apiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting || apiLoading}
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