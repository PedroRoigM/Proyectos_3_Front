// Este componente es una página para subir un Trabajo de Fin de Grado (TFG) dentro de un sistema de gestión.
// Permite a los usuarios completar un formulario con información del TFG, como el año, grado, estudiante, tutor, título, resumen, archivo y palabras clave.
// Incluye validaciones de formulario, manejo de errores, y confirmación antes de enviar los datos.
// Los datos se envían a través de funciones asincrónicas que interactúan con la API del backend para guardar el TFG y su archivo asociado.

'use client'; // Indica que este componente se ejecuta en el cliente (Next.js).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostTFG from '../components/lib/PostTFG'; // Función para enviar los datos del TFG al backend.
import PatchTfgFile from '../components/lib/PatchTfgFile'; // Función para subir el archivo del TFG al backend.
import GetAdvisors from '../components/lib/GetAdvisors'; // Función para obtener la lista de tutores.
import GetDegrees from '../components/lib/GetDegrees'; // Función para obtener la lista de grados.
import GetYears from '../components/lib/GetYears'; // Función para obtener la lista de años.
import LoadingSpinner from '../components/LoadingSpinner'; // Componente para mostrar un spinner de carga.

export default function Page() {
    const router = useRouter(); // Hook para redirigir al usuario a otras páginas.
    const [formData, setFormData] = useState({
        year: '', // Año del TFG.
        degree: '', // Grado del TFG.
        student: '', // Nombre del estudiante.
        advisor: '', // Tutor asignado.
        keywords: [], // Palabras clave asociadas al TFG.
        tfgTitle: '', // Título del TFG.
        abstract: '', // Resumen del TFG.
        file: null, // Archivo del TFG (inicialmente null).
    });
    const [advisors, setAdvisors] = useState([]); // Lista de tutores.
    const [years, setYears] = useState([]); // Lista de años disponibles.
    const [degrees, setDegrees] = useState([]); // Lista de grados disponibles.
    const [inputValue, setInputValue] = useState(""); // Valor del input para añadir palabras clave.
    const [showConfirmation, setShowConfirmation] = useState(false); // Estado para mostrar el cuadro de confirmación.
    const [errors, setErrors] = useState({}); // Objeto para almacenar errores de validación.
    const [loading, setLoading] = useState(false); // Estado para mostrar el spinner de carga durante el envío.
    const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el spinner de carga inicial.
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para mostrar el spinner durante el envío del formulario.

    // useEffect para cargar datos iniciales (tutores, años y grados) al montar el componente.
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

    // Maneja los cambios en los campos del formulario.
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

    // Maneja el cambio del archivo subido.
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0]
        });
    };

    // Maneja el cambio del input para palabras clave.
    const handleInputChange = (e) => setInputValue(e.target.value);

    // Añade una palabra clave al array de palabras clave.
    const handleAddKeyword = () => {
        if (inputValue.trim() !== "" && !formData.keywords.includes(inputValue.trim())) {
            setFormData({
                ...formData,
                keywords: [...formData.keywords, inputValue.trim()]
            });
            setInputValue("");
        }
    };

    // Elimina una palabra clave del array.
    const handleRemoveKeyword = (index) => {
        setFormData({
            ...formData,
            keywords: formData.keywords.filter((_, i) => i !== index)
        });
    };

    // Maneja el envío del formulario y muestra el cuadro de confirmación.
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    // Maneja la confirmación del envío del formulario.
    const handleConfirmSubmit = async (confirm) => {
        setShowConfirmation(false);
        setLoading(true);
        setErrors({});

        // Validaciones del formulario.
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
            router.push('/dashboard'); // Redirige al dashboard tras el envío exitoso.
        } catch {
            setErrors({ file: '❌ Ha ocurrido un error, intenta de nuevo.' });
        }
        setLoading(false);
    };

    // Renderiza un spinner de carga mientras se cargan los datos iniciales.
    if (isLoading) {
        return <LoadingSpinner message="Cargando formulario..." />;
    }

    // Renderiza el formulario y el cuadro de confirmación.
    return (
        <div className="flex items-center justify-center min-h-screen p-5 bg-gradient-to-b from-white to-gray-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-[50%] lg:w-[50%]">
                <h1 className="text-gray-800 font-bold text-2xl text-center mb-4">Subir TFG</h1>

                {isSubmitting ? (
                    <div className="py-10">
                        <LoadingSpinner message="Subiendo TFG, por favor espera..." />
                    </div>
                ) : (
                    <>
                        {/* Mensaje de error general */}
                        {errors.general &&
                            <div className={`p-3 mb-4 rounded-md ${errors.general.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {errors.general}
                            </div>
                        }

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Campos del formulario */}
                            {/* ... */}
                        </form>

                        {/* Cuadro de confirmación */}
                        {showConfirmation && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
                                <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
                                    <p className="text-lg text-center mb-4">¿Estás seguro de que quieres enviar el TFG? <br /> El TFG pasará a pertenecer a la universidad y solo se podrá editar contactando con coordinación.</p>
                                    <div className="flex justify-around">
                                        <button
                                            type="button"
                                            onClick={() => handleConfirmSubmit(true)}
                                            className="bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#1d4996] transition"
                                        >
                                            Sí
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleConfirmSubmit(false)}
                                            className="px-8 text-black border-2 font-bold py-2 rounded-md hover:bg-[#9da3a7] transition"
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