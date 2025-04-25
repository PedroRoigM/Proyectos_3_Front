// src/app/dashboard/admin/components/styles/components.js

export const styles = {
    // Layout ("Header")
    layout: {
        flexCenter: "flex flex-col min-h-screen bg-gray-100 p-6",
        card: "w-full bg-white border-b-[2px] border-[#14192c] shadow-md p-1 md:p-1",
        title: "text-3xl font-bold text-gray-800",
        subtitle: "text-gray-600 mt-2"
    },

    //Tabs (Donde pone Tutores, Grados y Años)
    tabs: {
        container: "bg-white rounded-lg shadow-md mb-6",
        container_window: "flex border-b border-gray-200",
        window_layout: "flex-1 py-4 px-6 font-medium",
        active_window: "text-blue-600 border-b-2 border-blue-600 bg-blue-50",
        inactive_window: "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
    },

    //Panel (Donde están los elementos)
    panel: {
        container: "p-6",
        controlers: "flex flex-col mb-6 space-y-4",
        toggle: { //Botón de "Mostrar elementos inactivos"
            container: "flex items-center",
            label: "inline-flex items-center cursor-pointer",
            input: "sr-only peer",
            switch: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600",
            text: "ml-3 text-sm font-medium text-gray-700"
        },
        foms: { //Formulario de creación
            container: "flex space-x-2",
            input: "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
            button: "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        },
        content: { //Contenido de cada ventana del panel
            container: "space-y-4",
            title: "text-xl font-semibold text-gray-800 mb-4",
            filter: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
            nofiltered: "bg-gray-50 rounded-lg p-8 text-center",
            text: "text-gray-500"
        },
        confirmation: { //Modal de confirmación
            overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
            container: "bg-white p-6 rounded-lg shadow-lg max-w-md w-full",
            title: "text-xl font-semibold mb-4",
            message: "mb-6 text-gray-600",
            button_container: "flex justify-end space-x-3",
            cancel_button: "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition",
            confirm_button: "px-4 py-2 text-white rounded-md transition",
            red_cancel: "bg-red-600 hover:bg-red-700",
            blue_cancel: "bg-blue-600 hover:bg-blue-700"
        },
        search: { // Componente de búsqueda
            container: "w-full",
            input: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
            clearButton: "absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        }
    },

    roles: {
        container: "container mx-auto p-4",
        title: "text-2xl font-bold mb-4",
        search: {
            container: "w-full mb-4",
            input: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
            clearButton: "absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        },
        userList: {
            empty: "text-center py-8 text-gray-500",
            container: "mt-6 space-y-4"
        }
    },

    search: {
        container: "font-montserrat w-full h-full flex flex-col justify-center  mx-auto my-[50px] rounded-md max-w-[90%] md:max-w-[80%] lg:max-w-[70%]",
        title: "text-4xl font-bold mb-4",
        TFG_result: "flex-col gap-4",
        button_container: "flex justify-between mt-4",
        button: "px-4 py-2 bg-gray-300 rounded-md"
    },

    specific_tfg: {
        id: {
            container: "font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%]",
            title: "flex items-center justify-between p-5 pr-3 pl-3 rounded-md max-w-full overflow-hidden text-black",
            button: {
                container: "flex gap-10",
                edit: "bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#14192c] transition",
                download: "text-black border-gray-400 border-2 font-bold px-4 py-2 rounded-md hover:bg-[#9da3a7] transition",
            },
            info: {
                container: "bg-[#e5e9ec] flex flex-wrap items-center justify-between p-5 pr-3 pl-3 rounded-md max-w-full overflow-hidden",
                //Contenedor de los datos: palabras clave + tutor y año
                keywords: {
                    container: "flex gap-2 flex-wrap", //Container de las palabras calve
                    keyword: "border border-gray-500 rounded-md px-2 py-1", //Una palabra clave
                    extend: "text-blue-500 underline ml-2" //Botón de extender palabras clave
                },
                tutoryear: "flex ml-auto text-right gap-x-4", //Container que tiene el tutor y el año
            },
            resumen: "mt-2 mb-8 bg-[#BEBEBE] p-5 border border-[#000000]", //Contenedor del resumen. bg para color de fondo, border para color del borde.

            pdf: {
                margin: "mt-4", //Margen
                title: "text-xl font-semibold mb-4", //Texto de "Documento TFG"
                image: {
                    container: "relative w-full h-[800px] overflow-hidden rounded bg-gray-100 shadow-lg",
                    //Contenedor de la imagen
                    watermark: "absolute inset-0 flex items-center justify-center z-10 pointer-events-none",
                    //Marca de agua
                    warning: "transform rotate-45 text-gray-400 text-5xl font-bold opacity-10 whitespace-nowrap",
                    //Texto de aviso de la marca de agua
                },

                notvisualizable: {
                    container: "w-full h-full overflow-hidden",
                    object: "w-full h-[calc(100%+40px)] -mt-10 border-0",
                    text: "p-4 text-center", //Mensaje de no puede verse por el navegador
                },

                blocker: "absolute top-0 left-0 right-0 h-10 bg-white opacity-0 z-20", //Bloquedor de interacciones
                text: "bg-gray-100 p-3 rounded text-center text-sm text-gray-600 mt-2" //Mensaje de aviso de protección 
            },
        },


    },

    edit: {
        container: "flex items-center justify-center min-h-screen p-5 bg-gradient-to-b from-white to-gray-400", //Container del fondo.
        form: {
            container: "bg-white p-8 rounded-lg shadow-lg w-full md:w-[50%] lg:w-[50%]",
            title: "text-gray-800 font-bold text-2xl text-center mb-4",
            space: "space-y-4",
            subtitle: "block text-[#0065ef] font-semibold",
            input: "w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#0065ef] focus:border-[#0065ef]",
            error: "text-red-500 text-sm",
        },

        file: {
            button: "w-full p-2 rounded-md border",
            error: "border-red-500",
            normal: "border-gray-300",
            text: "text-gray-600 text-sm truncate",
        },

        keywords: {
            container: "flex gap-2",
            addbutton: "bg-[#0065ef] text-white font-bold px-4   rounded-md hover:bg-blue-700 transition",
            list: "flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md",
        },

        button: "w-full bg-[#0065ef] text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200",

        confirmation: {
            flex: "fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50",
            container: "bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md",
            text: "text-lg text-center mb-4",
            button: {
                button_flex: "flex justify-around",
                button_yes: "bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#1d4996] transition",
                button_no: "px-8 text-black border-2 font-bold py-2 rounded-md hover:bg-[#9da3a7] transition",
            },
        },


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