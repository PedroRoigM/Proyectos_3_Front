// src/app/components/styles/tfg-details-common.js
export const tfgDetailsCommonStyles = {
    // Layout principal
    layout: {
        container: "w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-[#f2f5fa]",
        contentWrapper: "bg-white rounded-lg shadow-md overflow-hidden mb-6", // Separar los contenedores
        pdfWrapper: "bg-white rounded-lg shadow-md overflow-hidden", // Contenedor para el PDF
        innerContainer: "p-6",
    },

    // Header con título y acciones
    header: {
        container: "flex flex-row items-start justify-between gap-4 mb-4",
        titleContainer: "flex-1 min-w-0", // Para permitir truncamiento
        title: "text-xl font-bold text-gray-800 break-words",
        subtitle: "text-base text-gray-600 mt-1",
        actionsContainer: "flex flex-wrap gap-2",
        primaryButton: "bg-[#0065ef] text-white px-4 py-1 rounded text-sm font-medium hover:bg-[#0047b3] transition text-center",
        secondaryButton: "border border-gray-300 px-4 py-1 rounded text-sm font-medium hover:bg-gray-100 transition text-center",
    },

    // Metadata y keywords
    metadata: {
        // Contenedor de etiquetas
        tagsRow: "flex flex-wrap gap-2 mb-4",
        tag: "bg-[#f2f5fa] border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm",

        // Información de año y tutor
        infoRow: "flex justify-end text-sm text-gray-600 mb-2",
        infoItem: "ml-4",
        infoLabel: "font-normal",
        infoValue: "font-normal",
    },

    // Abstract section
    abstract: {
        container: "mt-2",
        title: "text-base font-bold mb-2 text-gray-800",
        content: "text-gray-700 leading-relaxed bg-white p-1",
        placeholder: "h-4 bg-gray-300 rounded my-2 w-full", // Para las líneas de placeholder
    },

    // PDF Viewer
    pdf: {
        container: "mt-4",
        title: "text-xl font-semibold mb-4",
        viewerContainer: "relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded bg-white shadow-lg p-4",
        watermark: "absolute inset-0 flex items-center justify-center z-10 pointer-events-none",
        watermarkText: "transform rotate-45 text-gray-400 text-5xl font-bold opacity-10 whitespace-nowrap",
        objectContainer: "w-full h-full overflow-hidden",
        pdfObject: "w-full h-[calc(100%+40px)] -mt-10 border-0",
        fallbackMessage: "p-4 text-center",
        protectionOverlay: "absolute top-0 left-0 right-0 h-10 bg-white opacity-0 z-20",
        disclaimer: "bg-gray-100 p-3 rounded text-center text-sm text-gray-600 mt-2",
        pdfTitle: "text-center font-bold uppercase my-8",
        pdfSubtitle: "text-center font-bold uppercase my-4",
        logos: "flex justify-center items-center gap-12 my-12",
        logo: "h-20",
    },

    // Loading and error states
    states: {
        loadingContainer: "flex flex-col items-center justify-center py-12",
        loadingSpinner: "w-12 h-12 border-4 border-[#0065ef] border-t-transparent rounded-full animate-spin mb-4",
        loadingText: "text-[#0065ef] font-medium",
        errorContainer: "text-center py-10",
        errorText: "text-red-500 text-lg",
    },
};