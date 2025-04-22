'use client';

/**
 * Validates email formats for U-tad domain
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export function isValidUtadEmail(email) {
    // Pattern for nombre.apellido@u-tad.com or nombre.apellidoN@live.u-tad.com
    const utadEmailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\d?@(u-tad\.com|live\.u-tad\.com)$/;
    return utadEmailRegex.test(email);
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result and message
 */
export function validatePassword(password) {
    if (!password) {
        return { valid: false, message: 'La contraseña es obligatoria.' };
    }

    if (password.length < 7) {
        return { valid: false, message: 'La contraseña debe tener al menos 7 caracteres.' };
    }

    // Must contain at least one lowercase, one uppercase and one number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;
    if (!strongPasswordRegex.test(password)) {
        return {
            valid: false,
            message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número.'
        };
    }

    return { valid: true, message: '' };
}

/**
 * Validates TFG form fields
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Object with validation errors
 */
export function validateTFGForm(formData) {
    const errors = {};

    if (!formData.year) errors.year = 'El año es obligatorio.';
    if (!formData.degree) errors.degree = 'El grado es obligatorio.';
    if (!formData.tfgTitle) errors.tfgTitle = 'El título del TFG es obligatorio.';
    if (!formData.abstract) errors.abstract = 'El resumen es obligatorio.';
    if (!formData.advisor) errors.advisor = 'El tutor es obligatorio.';
    if (!formData.student) errors.student = 'El nombre del estudiante es obligatorio.';

    if (!formData.file) {
        errors.file = 'El archivo es obligatorio.';
    } else if (formData.file.type !== 'application/pdf') {
        errors.file = 'Solo se aceptan archivos PDF.';
    }

    if (!formData.keywords || formData.keywords.length < 3) {
        errors.keywords = 'Añade al menos 3 palabras claves.';
    }

    return errors;
}

/**
 * Validates login form fields
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Object with validation errors
 */
export function validateLoginForm(formData) {
    const errors = {};

    if (!formData.email) {
        errors.email = 'El email es obligatorio.';
    } else if (!isValidUtadEmail(formData.email)) {
        errors.email = 'El email debe tener el formato nombre.apellido@u-tad.com o nombre.apellidoN@live.u-tad.com.';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
        errors.password = passwordValidation.message;
    }

    return errors;
}

/**
 * Validates registration form fields
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Object with validation errors
 */
export function validateRegisterForm(formData) {
    const errors = {};

    if (!formData.name) {
        errors.name = 'El nombre es obligatorio.';
    }

    if (!formData.email) {
        errors.email = 'El email es obligatorio.';
    } else if (!isValidUtadEmail(formData.email)) {
        errors.email = 'El email debe tener el formato nombre.apellido@u-tad.com o nombre.apellidoN@live.u-tad.com.';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
        errors.password = passwordValidation.message;
    }

    return errors;
}

/**
 * Validates password recovery form fields
 * @param {Object} formData - Form data to validate
 * @param {number} step - Current step in recovery process
 * @returns {Object} - Object with validation errors
 */
export function validateRecoverPasswordForm(formData, step) {
    const errors = {};

    if (step === 1) {
        if (!formData.email) {
            errors.account = 'El email es obligatorio.';
        } else if (!isValidUtadEmail(formData.email)) {
            errors.account = 'El email debe tener el formato nombre.apellido@u-tad.com o nombre.apellidoN@live.u-tad.com.';
        }
    } else if (step === 2) {
        if (!formData.code) {
            errors.code = 'El código es obligatorio.';
        } else if (formData.code.length !== 6 || !/^\d+$/.test(formData.code)) {
            errors.code = 'El código debe ser de 6 dígitos.';
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.valid) {
            errors.account = passwordValidation.message;
        }
    }

    return errors;
}

/**
 * Generic function to validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array<string>} requiredFields - List of required field names
 * @returns {Object} - Object with validation errors
 */
export function validateRequiredFields(data, requiredFields) {
    const errors = {};

    requiredFields.forEach(field => {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            errors[field] = `El campo ${field} es obligatorio.`;
        }
    });

    return errors;
}