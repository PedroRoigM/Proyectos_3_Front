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
    tabs:{
        container: "bg-white rounded-lg shadow-md mb-6",
        container_window: "flex border-b border-gray-200",
        window_layout: "flex-1 py-4 px-6 font-medium",
        active_window: "text-blue-600 border-b-2 border-blue-600 bg-blue-50",
        inactive_window: "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
    },

    panel:{
        container: "p-6",
        controlers: "flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0", 
        toggle:{
            container: "flex items-center",
            label: "inline-flex items-center cursor-pointer",
            input: "sr-only peer",
            switch: "relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600",
            text: "ml-3 text-sm font-medium text-gray-700"
        },
        foms:{
            container: "flex space-x-2",
            input: "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
            button: "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        },
        content:{
            container: "space-y-4",
            title: "text-xl font-semibold text-gray-800 mb-4",
            filter: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
            nofiltered: "bg-gray-50 rounded-lg p-8 text-center",
            text: "text-gray-500"
        },
        confirmation:{
            overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
            container: "bg-white p-6 rounded-lg shadow-lg max-w-md w-full",
            title: "text-xl font-semibold mb-4",
            message: "mb-6 text-gray-600",
            button_container:"flex justify-end space-x-3",
            cancel_button: "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition",
            confirm_button:"px-4 py-2 text-white rounded-md transition",
            red_cancel: "bg-red-600 hover:bg-red-700",
            blue_cancel: "bg-blue-600 hover:bg-blue-700"
        }     
    }



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

