export const styles = {
    // General Styles
    general: {
        container: "w-11/12 sm:w-10/12 md:w-9/12 lg:w-4/5 xl:w-4/5 mx-auto",
        flex: "flex",
        flexCol: "flex-col",
        itemsCenter: "items-center",
        justifyBetween: "justify-between",
        justifyCenter: "justify-center",
        flexWrap: "flex-wrap",
        gap1: "gap-1",
        gap2: "gap-2",
        gap3: "gap-3",
        gap4: "gap-4",
        textCenter: "text-center",
        shadow: "shadow-md",
        rounded: "rounded-md",
        border: "border",
        transition: "transition duration-300",
        hoverText: "hover:text-[#14192c]"
    },

    // Header Styles
    header: {
        base: "w-full bg-white border-b-[2px] shadow-md p-1",
        admin: "border-[#14192c]",
        coordinator: "border-[#0065ef]",
        user: "border-black",
        logo: "cursor-pointer",
    },

    // Navigation Styles
    navigation: {
        desktop: "hidden md:flex items-center gap-4",
        mobile: "md:hidden flex flex-col items-center gap-4 py-4 text-lg border-t border-gray-300 mx-4",
        link: "hover:text-[#14192c] transition duration-300 font-medium mx-2",
        adminLink: "flex items-center gap-1 text-[#0065ef] hover:text-[#14192c] transition duration-300 font-medium mx-2",
        logoutButton: "flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors mx-2"
    },

    // Dropdown Styles
    dropdown: {
        container: "relative",
        menu: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-200",
        item: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    },

    // Button Styles
    button: {
        base: "rounded-md px-3 py-1 text-sm font-bold transition",
        blue: "bg-[#0065ef] text-white hover:bg-[#0047b3]",
        red: "text-red-600 hover:text-red-800"
    },

    // Spinner Styles
    spinner: {
        base: "animate-spin rounded-full border-t-4 border-b-4 border-[#0065ef] mb-4",
        small: "w-8 h-8 rounded-full border-2 border-t-[#0065ef] border-gray-300"
    },

    // Card Styles
    card: {
        base: "border w-full border-gray-300 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow",
        header: "bg-white p-4 hover:bg-gray-50 transition",
        title: "text-lg md:text-xl font-semibold text-gray-800",
        subtitle: "text-sm md:text-md text-gray-700 mt-1",
        description: "text-xs md:text-sm text-gray-600 mt-2",
        keywords: "flex flex-wrap gap-2 bg-gray-100 p-3",
        keyword: "bg-[#e6edff] text-[#0065ef] border border-[#b5c9ff] rounded-full px-2 py-1 text-xs md:text-sm"
    },

    // Form Styles
    form: {
        base: "flex flex-col gap-3 text-black",
        input: "border border-gray-400 rounded-md px-2 py-1 w-full text-sm focus:ring-2 focus:ring-[#0065ef] focus:border-[#0065ef] outline-none",
        select: "border border-gray-400 rounded-md px-2 py-1 text-sm w-full sm:w-auto flex-1"
    }
};

// Function to combine style classes
export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Function to apply conditional styles (e.g., for error handling in forms)
export function inputClassName(hasError) {
    return classNames(
        styles.form.input,
        hasError ? "border-red-500 ring-red-500" : "border-gray-400 focus:ring-[#0065ef]"
    );
}
