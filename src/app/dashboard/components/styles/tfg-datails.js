// src/app/dashboard/components/styles/tfg-details.js
// Estilos específicos para la página de detalles de TFG

export const tfgDetailsStyles = {
    // Layout principal
    layout: {
      container: "font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%]",
    },
    
    // Header con título y grado
    header: {
      container: "",
      title: "text-xl md:text-2xl font-semibold",
      degree: "text-md text-gray-700",
    },
    
    // Contenedor de metadatos (keywords, año, tutor)
    metadata: {
      container: "bg-[#e5e9ec] flex flex-wrap items-center justify-between p-5 pr-3 pl-3 rounded-md max-w-full overflow-hidden",
      keywordsContainer: "flex gap-2 flex-wrap",
      keyword: "border border-gray-500 rounded-md px-2 py-1",
      keywordToggle: "text-blue-500 underline ml-2",
      infoContainer: "flex ml-auto text-right gap-x-4",
      infoLabel: "font-bold",
    },
    
    // Resumen del TFG
    abstract: {
      container: "mt-2 mb-8 bg-[#BEBEBE] p-5 border border-[#000000]",
      title: "font-semibold mb-2",
      text: "text-sm md:text-base",
    },
    
    // Sección del PDF
    pdf: {
      container: "mt-4",
      title: "text-xl font-semibold mb-4",
      viewerContainer: "relative w-full h-[600px] overflow-hidden rounded bg-gray-100 shadow-lg",
      watermark: "absolute inset-0 flex items-center justify-center z-10 pointer-events-none",
      watermarkText: "transform rotate-45 text-gray-400 text-5xl font-bold opacity-10 whitespace-nowrap",
      objectContainer: "w-full h-full overflow-hidden",
      pdfObject: "w-full h-[calc(100%+40px)] -mt-10 border-0",
      fallbackMessage: "p-4 text-center",
      protectionOverlay: "absolute top-0 left-0 right-0 h-10 bg-white opacity-0 z-20",
      disclaimer: "bg-gray-100 p-3 rounded text-center text-sm text-gray-600 mt-2",
    },
  };