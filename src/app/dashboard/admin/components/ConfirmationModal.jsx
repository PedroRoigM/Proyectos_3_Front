import React from 'react';

const ConfirmationModal = ({ modalType, onCancel, onConfirm, styles }) => {
    const isDelete = modalType.startsWith('delete');

    return (
        <div className={styles.panel.confirmation.overlay}>
            <div className={styles.panel.confirmation.container}>
                <h3 className={styles.panel.confirmation.title}>
                    {isDelete
                        ? '¿Confirmar eliminación?'
                        : '¿Confirmar cambio de estado?'}
                </h3>
                <p className={styles.panel.confirmation.message}>
                    {isDelete
                        ? 'Esta acción eliminará este elemento de forma permanente.'
                        : 'Esta acción cambiará la visibilidad del elemento en el sistema.'}
                </p>
                <div className={styles.panel.confirmation.button_container}>
                    <button
                        onClick={onCancel}
                        className={styles.panel.confirmation.cancel_button}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`${styles.panel.confirmation.confirm_button} ${isDelete
                            ? styles.panel.confirmation.red_cancel
                            : styles.panel.confirmation.blue_cancel
                            }`}
                    >
                        {isDelete ? 'Eliminar' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;