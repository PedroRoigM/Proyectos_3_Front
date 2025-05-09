// Estilos específicos para la página de edición de TFG

export const editTfgStyles = {
    // Layout principal
    layout: {
        container: "flex items-center justify-center min-h-screen p-5 bg-[#edf1fc]",
        formContainer: "p-8 rounded-lg shadow-lg w-[80%] mx-auto",
    },

    // Encabezados
    headings: {
        title: "text-gray-800 font-bold text-2xl text-center mb-6",
        subtitle: "text-gray-700 text-lg font-semibold mb-3",
    },

    // Feedback y notificaciones
    feedback: {
        success: "bg-green-100 text-green-800 p-3 rounded-md mb-4 text-sm font-medium",
        error: "bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm font-medium",
    },

    // Barra superior con título y acciones
    header: {
        container: "flex items-center justify-between p-5 bg-white border-b border-gray-200 mb-6",
        title: "text-xl font-semibold truncate max-w-lg",
        actionsContainer: "flex gap-4",
        editButton: "bg-blue-600 px-6 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition",
        secondaryButton: "text-gray-800 border border-gray-400 font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition",
    },

    // Metadata
    metadata: {
        container: "bg-gray-100 flex flex-wrap items-center justify-between p-5 rounded-md mb-6",
        keywordsContainer: "flex gap-2 flex-wrap",
        keyword: "border border-blue-500 text-blue-600 bg-white rounded-md px-2 py-1",
        toggleButton: "text-blue-600 underline ml-2",
        infoContainer: "flex text-right gap-4 text-gray-700",
        infoLabel: "font-medium",
    },

    // Abstract
    abstract: {
        container: "mb-8 bg-white p-5 border rounded-md shadow-sm",
        textarea: "w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none p-2",
    },

    // PDF viewer
    pdf: {
        container: "mt-8 mb-10",
        title: "text-xl font-semibold mb-4",
        uploadContainer: "mb-6 bg-white p-5 rounded-md shadow-sm",
        uploadInfo: "flex items-center justify-between",
        fileInfo: "text-sm text-gray-600 truncate",
        uploadButton: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition",
        viewerContainer: "relative w-full h-[800px] overflow-hidden rounded bg-gray-100 shadow-lg",
        watermark: "absolute inset-0 flex items-center justify-center z-10 pointer-events-none",
        watermarkText: "transform rotate-45 text-gray-400 text-5xl font-bold opacity-10 whitespace-nowrap",
        pdfObject: "w-full h-[calc(100%+40px)] -mt-10 border-0",
        fallbackMessage: "p-4 text-center",
        protectionOverlay: "absolute top-0 left-0 right-0 h-10 bg-white opacity-0 z-20",
        disclaimer: "bg-gray-100 p-3 rounded text-center text-sm text-gray-600 mt-2",
    },

    // Formularios
    form: {
        container: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-20", // Aumentado el margen inferior
        group: "bg-white p-4 rounded-md shadow-sm",
        label: "block text-gray-700 font-medium mb-2",
        input: {
            base: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            valid: "border-gray-300",
            error: "border-red-500",
        },
        select: {
            base: "w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
            valid: "border-gray-300",
            error: "border-red-500",
        },
        error: "text-red-500 text-sm mt-1",
    },

    // Keywords
    keywords: {
        container: "bg-white p-4 rounded-md shadow-sm",
        inputContainer: "flex space-x-2 mb-2",
        input: "flex-1 p-2 border border-gray-300 rounded-md",
        addButton: "bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition flex items-center",
        list: "flex flex-wrap gap-2 mt-2",
        tag: "flex items-center bg-gray-100 px-2 py-1 rounded-md border border-gray-300",
        removeButton: "ml-2 bg-gray-200 text-red-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors",
    },

    // Modal de confirmación
    modal: {
        overlay: "fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50",
        container: "bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md",
        message: "text-lg text-center mb-4",
        buttonsContainer: "flex justify-around",
        confirmButton: "bg-blue-600 px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-blue-700 transition",
        cancelButton: "px-8 text-black border-2 font-bold py-2 rounded-md hover:bg-gray-200 transition",
    },
};

// Función para combinar clases de estilo
export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Función para aplicar condicionalmente un estilo de error o normal a inputs
export function inputClassName(hasError) {
    return classNames(
        editTfgStyles.form.input.base,
        hasError ? editTfgStyles.form.input.error : editTfgStyles.form.input.valid
    );
}

// Función para aplicar condicionalmente un estilo de error o normal a selects
export function selectClassName(hasError) {
    return classNames(
        editTfgStyles.form.select.base,
        hasError ? editTfgStyles.form.select.error : editTfgStyles.form.select.valid
    );
}