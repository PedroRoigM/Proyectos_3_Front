export const footerStyles = {
    footer: {
        container: "bg-[#14192c] text-white py-10",
        layout: "max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
        section: "space-y-3 text-sm",
        link: "block text-gray-300 hover:text-white transition duration-300 cursor-pointer",

        social: {
            container: "flex space-x-4 mb-4",
            icon: "text-gray-300 hover:text-white text-xl transition duration-300"
        },

        logos: {
            title: "text-sm font-semibold text-white mt-4",
            image: "h-10 mb-2",
            imageSm: "h-8 mb-2"
        },

        bottom: "mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-400 flex flex-col md:flex-row justify-between items-center gap-2"
    }
};