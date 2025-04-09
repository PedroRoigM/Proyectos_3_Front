// src/app/components/styles/recover-password.js
// Estilos específicos para la página de recuperación de contraseña

export const recoverPasswordStyles = {
    // Layout principal
    layout: {
      container: "font-montserrat rounded-md from-white to-gray-400 bg-gradient-to-b h-screen",
      wrapper: "flex items-center justify-center mt-[8%]",
      formContainer: "flex flex-col bg-white p-10 rounded-lg shadow-lg w-4/5 md:w-2/5 lg:w-1/3 text-center",
    },
    
    // Encabezados
    headings: {
      title: "text-gray-800 font-bold text-2xl mb-[20%]",
      paragraph: "mb-[5%]",
    },
    
    // Formularios
    form: {
      container: "mb-[20%]",
      section: "mb-[5%]",
      input: {
        base: "p-2 rounded-md w-full border-2",
        valid: "border-black",
        error: "border-red-500",
      },
      error: "text-red-500",
    },
    
    // Botones
    buttons: {
      container: "flex justify-between mt-4",
      primary: "bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#14192c] transition",
      secondary: "bg-[#ffffff] text-black border-2 border-[#14192c] font-bold px-4 py-2 rounded-md hover:bg-[#9da3a7] transition",
    },
  };
  
  // Función para combinar clases de estilo
  export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  // Función para aplicar condicionalmente un estilo de error o normal
  export function inputClassName(hasError) {
    return classNames(
      recoverPasswordStyles.form.input.base,
      hasError ? recoverPasswordStyles.form.input.error : recoverPasswordStyles.form.input.valid
    );
  }