export const editTfgStyles = {
    // Layout principal
    layout: {
        container: "min-h-screen bg-gray-100 p-5",
        formContainer: "mx-[15%] rounded-lg shadow-lg overflow-hidden",
    },

    // Encabezados
    headings: {
        title: "text-xl sm:text-2xl font-bold text-gray-800 mb-6",
        subtitle: "text-lg font-semibold text-gray-700 mb-2",
    },

    // Feedback y notificaciones
    feedback: {
        success: "bg-green-100 text-green-800 p-4 mb-4 rounded-md text-sm font-medium flex items-center",
        error: "bg-red-100 text-red-800 p-4 mb-4 rounded-md text-sm font-medium flex items-center",
    },

    // Barra superior con título y acciones
    header: {
        container: "flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 mb-6",
        title: "text-xl font-semibold truncate max-w-full sm:max-w-lg mb-4 sm:mb-0",
        actionsContainer: "flex flex-wrap gap-2 w-full sm:w-auto",
        editButton: "bg-[#0065ef] px-3 sm:px-6 text-white font-medium py-2 rounded-md hover:bg-[#0047b3] transition flex-1 sm:flex-auto text-center",
        secondaryButton: "text-gray-800 border border-gray-300 font-medium px-3 sm:px-4 py-2 rounded-md hover:bg-gray-100 transition flex-1 sm:flex-auto text-center",
    },

    // Metadata
    metadata: {
        container: "bg-gray-100 flex flex-wrap items-start sm:items-center justify-between p-5 rounded-md mb-6",
        keywordsContainer: "flex gap-2 flex-wrap max-w-full sm:max-w-2xl mb-3 sm:mb-0",
        keyword: "border border-blue-500 text-blue-600  rounded-md px-2 py-1 text-sm",
        toggleButton: "text-blue-600 underline ml-2 text-sm",
        infoContainer: "flex flex-col sm:flex-row text-right gap-2 sm:gap-4 text-gray-700 w-full sm:w-auto mt-3 sm:mt-0",
        infoLabel: "font-medium",
    },

    // Abstract
    abstract: {
        container: "mb-8 bg-white rounded-md p-5 shadow-sm m-5",
        textarea: "w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none p-2 min-h-[150px]",
    },

    // PDF viewer
    pdf: {
        container: "mt-8 mb-10 p-5",
        title: "text-xl font-semibold mb-4",
        uploadContainer: "mb-6  p-5 rounded-md shadow-sm",
        uploadInfo: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
        fileInfo: "text-sm text-gray-600 truncate max-w-full",
        uploadButton: "bg-[#0065ef] hover:bg-[#0047b3] text-white font-medium py-2 px-4 rounded-md cursor-pointer transition flex items-center justify-center",
        viewerContainer: "relative w-full h-[500px] sm:h-[600px] md:h-[800px] overflow-hidden rounded bg-gray-100 shadow-lg",
        watermark: "absolute inset-0 flex items-center justify-center z-10 pointer-events-none",
        watermarkText: "transform rotate-45 text-gray-400 text-3xl sm:text-5xl font-bold opacity-10 whitespace-nowrap",
        pdfObject: "w-full h-[calc(100%+40px)] -mt-10 border-0",
        fallbackMessage: "p-4 text-center",
        protectionOverlay: "absolute top-0 left-0 right-0 h-10  opacity-0 z-20",
        disclaimer: "bg-gray-100 p-3 rounded text-center text-sm text-gray-600 mt-2",
    },

    // Formularios
    form: {
        container: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-6",
        group: " p-4 rounded-md shadow-sm",
        fullWidth: "col-span-1 md:col-span-2 lg:col-span-3",
        label: "block text-gray-700 font-medium mb-2 text-sm",
        input: {
            base: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm",
            valid: "border-gray-300",
            error: "border-red-500",
        },
        select: {
            base: "w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm",
            valid: "border-gray-300",
            error: "border-red-500",
        },
        error: "text-red-500 text-xs mt-1",
    },

    // Keywords
    keywords: {
        container: " p-4 rounded-md shadow-sm col-span-1 md:col-span-2 lg:col-span-3",
        inputContainer: "flex space-x-2 mb-2",
        input: "flex-1 p-2 border border-gray-300 rounded-md text-sm",
        addButton: "bg-[#0065ef] text-white px-3 py-1 rounded-md hover:bg-[#0047b3] transition flex items-center text-sm",
        list: "flex flex-wrap gap-2 mt-2",
        tag: "flex items-center bg-gray-100 px-2 py-1 rounded-md border border-gray-300 text-sm",
        removeButton: "ml-2 bg-gray-200 text-red-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors",
    },

    // Modal de confirmación
    modal: {
        overlay: "fixed bg-white inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50 p-4",
        container: " p-6 rounded-lg shadow-lg bg-white w-full max-w-md",
        message: "text-lg text-center mb-6",
        buttonsContainer: "flex flex-col sm:flex-row justify-center sm:justify-around gap-3",
        confirmButton: "bg-[#0065ef] px-6 text-white font-semibold py-2 rounded-md hover:bg-[#0047b3] transition order-2 sm:order-1",
        cancelButton: "px-6 text-gray-700 border border-gray-300 font-semibold py-2 rounded-md hover:bg-gray-200 transition order-1 sm:order-2",
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
