// src/app/dashboard/components/styles/search.js
// Estilos específicos para la página de búsqueda

export const searchStyles = {
    // Layout principal
    layout: {
      container: "font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%] md:max-w-[80%] lg:max-w-[70%]",
    },
    
    // Encabezados
    headings: {
      title: "text-4xl font-bold mb-4",
    },
    
    // Resultados
    results: {
      container: "flex flex-col gap-4",
      emptyState: "text-center py-10",
      emptyText: "text-gray-500 text-lg",
    },
    
    // Paginación
    pagination: {
      container: "flex justify-between mt-6",
      buttonBase: "px-4 py-2 rounded-md transition",
      buttonActive: "bg-gray-300 hover:bg-gray-400",
      buttonDisabled: "bg-gray-200 text-gray-400 cursor-not-allowed",
      pageCounter: "flex items-center px-4",
    },
    
    // Cargando
    loading: {
      container: "text-center py-10",
    },
  };
  
  // Función para combinar clases de estilo
  export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  // Función para aplicar estilo de botón de paginación según su estado
  export function paginationButtonClass(isDisabled) {
    return classNames(
      searchStyles.pagination.buttonBase,
      isDisabled 
        ? searchStyles.pagination.buttonDisabled 
        : searchStyles.pagination.buttonActive
    );
  }