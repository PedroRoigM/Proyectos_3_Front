import cardStyles from '../../../../dashboard/components/styles/TFGcard';

const styles = {
    // Heredar todos los estilos base de las tarjetas comunes
    ...cardStyles,

    // Estilos específicos para TFGcardUnverified
    container: {
        ...cardStyles.card,
        margin: '0 0 12px 0', // Reducido el margen
    },

    actionContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px', // Reducido el padding
        backgroundColor: '#E1E7FB',
        gap: '8px',
        '@media (maxWidth: 640px)': {
            flexDirection: 'column',
            alignItems: 'flex-start',
        }
    },

    keywordsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px' // Reducido el gap
    },

    buttonsContainer: {
        display: 'flex',
        gap: '6px', // Reducido el gap
        marginTop: '0',
        '@media (maxWidth: 640px)': {
            width: '100%',
            justifyContent: 'space-between'
        }
    },

    verifyButton: {
        backgroundColor: '#0065ef',
        color: 'white',
        fontSize: '0.75rem', // Reducido el tamaño de fuente
        fontWeight: '600',
        padding: '4px 12px', // Reducido el padding
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s',
        ':hover': {
            backgroundColor: '#0047b3'
        },
        ':disabled': {
            opacity: '0.5',
            cursor: 'not-allowed'
        },
        '@media (maxWidth: 640px)': {
            flex: '1'
        }
    },

    deleteButton: {
        backgroundColor: 'white',
        color: '#EF4444',
        border: '1px solid #EF4444',
        fontSize: '0.75rem', // Reducido el tamaño de fuente
        fontWeight: '600',
        padding: '4px 12px', // Reducido el padding
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s',
        ':hover': {
            backgroundColor: '#FEE2E2',
        },
        ':disabled': {
            opacity: '0.5',
            cursor: 'not-allowed'
        },
        '@media (maxWidth: 640px)': {
            flex: '1'
        }
    },

    loadingSpinner: {
        width: '12px', // Reducido el tamaño
        height: '12px', // Reducido el tamaño
        border: '2px solid',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '6px' // Reducido el margen
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