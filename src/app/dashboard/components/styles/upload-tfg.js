export const uploadTfgStyles = {
  // Layout principal
  layout: {
    container:
      "min-h-screen px-4 py-8 bg-gray-100 w-full",
    formContainer:
      "w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-5 sm:p-6 md:p-8",
  },

  // Encabezados
  headings: {
    title: "text-gray-800 text-2xl md:text-3xl font-bold text-center mb-6",
  },

  // Feedback y notificaciones
  feedback: {
    success:
      "bg-green-100 text-green-800 p-3 rounded-md mb-4 text-sm font-medium",
    error: "bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm font-medium",
  },

  // Formularios
  form: {
    container: "grid grid-cols-1 md:grid-cols-2 gap-6",
    group: "bg-white rounded-lg p-4 w-full col-span-1",
    fullWidth: "col-span-1 md:col-span-2",
    label: "block text-sm md:text-base font-semibold text-gray-700 mb-2",
    input: {
      base: "w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition",
      valid: "border-gray-300",
      error: "border-red-500",
    },
    select: {
      base: "w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition",
      valid: "border-gray-300",
      error: "border-red-500",
    },
    textarea: {
      base: "w-full px-4 py-2 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[150px]",
      valid: "border-gray-300",
      error: "border-red-500",
    },
    error: "text-red-500 text-xs mt-1",
    keywordInput: {
      container: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2",
      input: "flex-grow px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition",
      button: "bg-[#0065ef] text-white px-4 py-2 rounded-lg hover:bg-[#0047b3] transition text-sm font-bold shadow whitespace-nowrap",
    },
    keywordList: {
      container: "mt-3 flex flex-wrap gap-2",
      item: "flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm shadow-sm",
      text: "text-blue-800 font-medium",
      removeButton: "ml-2 text-red-500 hover:text-red-700 transition",
    },
    fileInput: {
      container: "border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer",
      preview: "bg-gray-100 border rounded-lg p-3 mt-2 break-all",
    }
  },

  // Modal de confirmación
  modal: {
    overlay:
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
    container: "bg-white p-6 rounded-xl w-full max-w-sm mx-4 shadow-md",
    message: "text-center text-base font-medium text-gray-800 mb-4",
    buttonsContainer: "flex justify-between gap-4 mt-4",
    confirmButton:
      "bg-[#0065ef] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#0047b3] transition",
    cancelButton:
      "border border-gray-400 text-gray-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-200 transition",
  },

  // Botones
  buttons: {
    primary:
      "bg-[#0065ef] border border-[#0065ef] text-white w-full py-3 rounded-lg font-semibold hover:bg-[#0047b3] transition shadow-md mt-6",
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
