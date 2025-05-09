import cardStyles from '../../../../dashboard/components/styles/TFGcard';

const styles = {
    // Heredar todos los estilos base de las tarjetas comunes
    ...cardStyles,

    // Estilos específicos para TFGcardUnverified
    container: {
        ...cardStyles.card,
    },

    actionContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#E1E7FB'
    },

    keywordsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px'
    },

    buttonsContainer: {
        display: 'flex',
        gap: '8px',
        marginTop: '8px',
        '@media (minWidth: 640px)': {
            marginTop: '0'
        }
    },

    verifyButton: {
        backgroundColor: '#3B82F6',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: '600',
        padding: '4px 16px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.3s',
        ':hover': {
            backgroundColor: '#1D4ED8'
        },
        ':disabled': {
            opacity: '0.5',
            cursor: 'not-allowed'
        }
    },

    deleteButton: {
        backgroundColor: 'white',
        color: '#EF4444',
        border: '1px solid #EF4444',
        fontSize: '0.875rem',
        fontWeight: '600',
        padding: '4px 16px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s',
        ':hover': {
            backgroundColor: '#EF4444',
            color: 'white'
        },
        ':disabled': {
            opacity: '0.5',
            cursor: 'not-allowed'
        }
    },

    loadingSpinner: {
        width: '16px',
        height: '16px',
        border: '2px solid',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '8px'
    },

    loadingSpinnerRed: {
        borderColor: '#EF4444',
        borderTopColor: 'transparent'
    },

    loadingSpinnerWhite: {
        borderColor: 'white',
        borderTopColor: 'transparent'
    }
};

export default styles;