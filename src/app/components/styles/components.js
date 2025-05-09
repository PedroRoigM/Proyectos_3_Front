// src/app/styles/components.js
// Este archivo contiene componentes de estilo reutilizables

export const styles = {
    // Contenedores
    container: {
        form: "bg-white mt-[10%] p-10 rounded-lg shadow-lg w-full max-w-md text-center",
    },

    // Encabezados
    headings: {
        h1: "text-gray-800 font-bold text-2xl mb-4",
        paragraph: "text-gray-700 mb-4",
    },

    // Formularios
    form: {
        container: "space-y-4",
        group: "text-left",
        label: "text-gray-700 block mb-1",
        input: {
            base: "w-full p-2 rounded-md border focus:outline-none",
            valid: "border-gray-300",
            error: "border-red-500",
        },
        error: "text-red-500 text-sm",
        loading: "text-gray-500",
    },

    // Botones
    buttons: {
        primary: "w-full bg-blue-500 text-white font-bold py-2 rounded-md mt-2",
        link: "cursor-pointer text-blue-600 text-sm",
    },

    // Errores
    errors: {
        text: "text-red-500",
        small: "text-red-500 text-sm mt-2"
    },

    // Layout
    layout: {
        flexCenter: "flex items-center justify-center mx-[15%]",
        topBar: "w-full bg-white border-b-[2px] border-[#14192c] shadow-md p-1 md:p-1"
    },
};

// Función para combinar clases de estilo
export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Función para aplicar condicionalmente un estilo de error o normal
export function inputClassName(hasError) {
    return classNames(
        styles.form.input.base,
        hasError ? styles.form.input.error : styles.form.input.valid
    );
}