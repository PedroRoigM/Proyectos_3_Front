// src/app/dashboard/components/styles/upload-tfg.js
// Estilos específicos para la página de subida de TFG

export const uploadTfgStyles = {
    // Layout principal
    layout: {
      container: "flex items-center justify-center min-h-screen p-5 bg-gradient-to-b from-white to-gray-400",
      formContainer: "bg-white p-8 rounded-lg shadow-lg w-full md:w-[50%] lg:w-[50%]",
    },
    
    // Encabezados
    headings: {
      title: "text-gray-800 font-bold text-2xl text-center mb-4",
    },
    
    // Feedback y notificaciones
    feedback: {
      success: "p-3 mb-4 rounded-md bg-green-100 text-green-700",
      error: "p-3 mb-4 rounded-md bg-red-100 text-red-700",
    },
    
    // Formularios
    form: {
      container: "space-y-4",
      group: "text-left",
      label: "text-gray-700 block mb-1",
      input: {
        base: "w-full p-2 rounded-md border",
        valid: "border-gray-300",
        error: "border-red-500",
      },
      select: {
        base: "w-full p-2 rounded-md border",
        valid: "border-gray-300",
        error: "border-red-500",
      },
      textarea: {
        base: "w-full p-2 rounded-md border",
        valid: "border-gray-300",
        error: "border-red-500",
      },
      error: "text-red-500 text-sm",
      keywordInput: {
        container: "flex items-center gap-2",
        input: "w-full p-2 rounded-md border",
        button: "bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition",
      },
      keywordList: {
        container: "mt-3 space-y-2",
        item: "flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md",
        text: "text-gray-800",
        removeButton: "text-red-500 hover:text-red-700",
      },
    },
    
    // Modal de confirmación
    modal: {
      overlay: "fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50",
      container: "bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md",
      message: "text-lg text-center mb-4",
      buttonsContainer: "flex justify-around",
      confirmButton: "bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#1d4996] transition",
      cancelButton: "px-8 text-black border-2 font-bold py-2 rounded-md hover:bg-[#9da3a7] transition",
    },
    
    // Botones
    buttons: {
      primary: "w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition",
    },
  };
  
  // Función para combinar clases de estilo
  export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  // Función para aplicar condicionalmente un estilo de error o normal a inputs
  export function inputClassName(hasError) {
    return classNames(
      uploadTfgStyles.form.input.base,
      hasError ? uploadTfgStyles.form.input.error : uploadTfgStyles.form.input.valid
    );
  }
  
  // Función para aplicar condicionalmente un estilo de error o normal a selects
  export function selectClassName(hasError) {
    return classNames(
      uploadTfgStyles.form.select.base,
      hasError ? uploadTfgStyles.form.select.error : uploadTfgStyles.form.select.valid
    );
  }
  
  // Función para aplicar condicionalmente un estilo de error o normal a textareas
  export function textareaClassName(hasError) {
    return classNames(
      uploadTfgStyles.form.textarea.base,
      hasError ? uploadTfgStyles.form.textarea.error : uploadTfgStyles.form.textarea.valid
    );
  }