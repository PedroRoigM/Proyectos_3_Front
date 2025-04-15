import React from 'react';

const CreateForm = ({
    type,
    value,
    onChange,
    onSubmit,
    placeholder,
    showInput = true,
    styles
}) => {
    return (
        <form onSubmit={onSubmit} className={styles.panel.foms.container}>
            {showInput && (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={styles.panel.foms.input}
                    required
                />
            )}
            <button
                type="submit"
                className={styles.panel.foms.button}
            >
                Añadir
            </button>
        </form>
    );
};

export default CreateForm;