// src/app/dashboard/components/styles/upload-tfg.js
// Estilos específicos para la página de subida de TFG
export const uploadTfgStyles = {
  // Layout principal
  layout: {
    container: "flex justify-center min-h-screen bg-[#edf1fc] px-4 py-12",
    formContainer: "w-full max-w-[720px] flex flex-col gap-6",
  },

  // Encabezados
  headings: {
    title: "text-gray-800 text-xl font-semibold text-center mb-4",
  },

  // Feedback y notificaciones
  feedback: {
    success: "bg-green-100 text-green-800 p-3 rounded-md mb-4 text-sm font-medium",
    error: "bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm font-medium",
  },

  // Formularios
  form: {
    container: "space-y-6",
    group: "bg-white rounded-lg shadow-sm p-5 w-full",
    label: "block text-sm font-semibold text-gray-700 mb-2 uppercase",
    input: {
      base: "w-full px-4 py-2 rounded-md border text-sm bg-[#f8fafc]",
      valid: "border-gray-300",
      error: "border-red-500",
    },
    select: {
      base: "w-full px-4 py-2 rounded-md border text-sm bg-[#f8fafc]",
      valid: "border-gray-300",
      error: "border-red-500",
    },
    textarea: {
      base: "w-full px-4 py-2 rounded-md border text-sm bg-[#f8fafc] resize-none",
      valid: "border-gray-300",
      error: "border-red-500",
    },
    error: "text-red-500 text-xs mt-1",
    keywordInput: {
      container: "flex items-center gap-2 mt-2",
      input: "flex-grow px-3 py-2 rounded-md border text-sm bg-[#f8fafc]",
      button: "bg-[#0065ef] text-white px-4 py-2 rounded-md hover:bg-[#0047b3] transition text-sm",
    },
    keywordList: {
      container: "mt-3 space-y-2",
      item: "flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md text-sm",
      text: "text-gray-800",
      removeButton: "text-red-500 hover:text-red-700",
    },
  },

  // Modal de confirmación
  modal: {
    overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
    container: "bg-white p-6 rounded-xl w-full max-w-sm shadow-md",
    message: "text-center text-base font-medium text-gray-800 mb-4",
    buttonsContainer: "flex justify-between gap-4 mt-4",
    confirmButton: "bg-[#0065ef] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#0047b3] transition",
    cancelButton: "border border-gray-400 text-gray-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-200 transition",
  },

  // Botones
  buttons: {
    primary: "bg-white border border-[#0065ef] text-[#0065ef] w-full py-2 rounded-md font-semibold hover:bg-[#f0f4ff] transition shadow-sm",
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