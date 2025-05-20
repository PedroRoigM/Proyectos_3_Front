import React, { useState } from 'react';
import Link from 'next/link';
import DeleteTFG from '../../components/lib/DeleteTFG';
import PatchValidateTFG from '../../components/lib/PatchValidateTFG';
import { useNotification } from '../../../components/errors/notification-context';
import { useApiError } from '../../../components/errors/api-error-hook';
import styles from './styles/TFGcardUnverifiedStyles';

export default function TFGcardUnverified({ tfg, onStatusChange }) {
    const [isVisible, setIsVisible] = useState(true);
    const { showSuccess, showError } = useNotification();
    const { loading, executeRequest } = useApiError();
    const [actionType, setActionType] = useState(''); // 'verify' o 'delete'

    const truncateText = (text, maxLength) => {
        if (!text) {
            return '';
        }
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    const validateTFG = async (id) => {
        setActionType('verify');
        try {
            const response = await executeRequest(
                async () => await PatchValidateTFG(id),
                {
                    loadingMessage: 'Verificando TFG...',
                    errorMessage: 'Error al verificar el TFG'
                }
            );

            if (response) {
                showSuccess('TFG verificado correctamente');
                handleValidationChange(id);
            } else {
                showError('No se pudo verificar el TFG');
            }
        } catch (error) {
            console.error('Error validating TFG:', error);
            showError('Error al verificar el TFG');
        } finally {
            setActionType('');
        }
    };

    const deleteTFG = async (id) => {
        setActionType('delete');
        try {
            const response = await executeRequest(
                async () => await DeleteTFG(id),
                {
                    loadingMessage: 'Eliminando TFG...',
                    errorMessage: 'Error al eliminar el TFG'
                }
            );

            if (response) {
                showSuccess('TFG eliminado correctamente');
                handleValidationChange(id);
            } else {
                showError('No se pudo eliminar el TFG');
            }
        } catch (error) {
            console.error('Error deleting TFG:', error);
            showError('Error al eliminar el TFG');
        } finally {
            setActionType('');
        }
    };

    const handleValidationChange = (id) => {
        // Ocultar la tarjeta localmente
        setIsVisible(false);

        // Notificar al componente padre sobre el cambio
        if (onStatusChange) {
            onStatusChange(id);
        }
    };

    if (!isVisible) {
        return null; // No renderiza nada si no es visible
    }

    // Mostrar menos palabras clave para ahorrar espacio
    const displayedKeywords = tfg.keywords.slice(0, 2); // Limitamos a 2 palabras clave máximo

    return (
        <div style={styles.container}>
            <Link href={`/dashboard/admin/tfg/${tfg._id}?id=${tfg._id}`} className="block">
                <div className="p-3 hover:bg-gray-200 transition">
                    <h2 style={styles.header}>
                        {truncateText(tfg.tfgTitle, 60)}
                    </h2>
                    <h3 style={styles.description}>
                        {tfg.degree.degree}
                    </h3>
                    <p style={styles.description}>
                        {truncateText(tfg.abstract, 120)}
                    </p>
                </div>
            </Link>

            <div style={styles.actionContainer}>
                {/* Palabras clave */}
                <div style={styles.keywordsContainer}>
                    {displayedKeywords.map((element, index) => (
                        <span key={index} style={styles.tag}>
                            {element}
                        </span>
                    ))}
                    {tfg.keywords.length > 2 && (
                        <span style={{ ...styles.tag, backgroundColor: '#EDF2FD' }}>
                            +{tfg.keywords.length - 2}
                        </span>
                    )}
                </div>

                {/* Botones */}
                <div style={styles.buttonsContainer}>
                    <button
                        style={{
                            ...styles.verifyButton,
                            opacity: loading ? 0.5 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => validateTFG(tfg._id)}
                        disabled={loading}
                    >
                        {actionType === 'verify' && loading ? (
                            <>
                                <div style={{ ...styles.loadingSpinner, ...styles.loadingSpinnerWhite }}></div>
                                <span>Verificando...</span>
                            </>
                        ) : (
                            'Verificar'
                        )}
                    </button>
                    <button
                        style={{
                            ...styles.deleteButton,
                            opacity: loading ? 0.5 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => deleteTFG(tfg._id)}
                        disabled={loading}
                    >
                        {actionType === 'delete' && loading ? (
                            <>
                                <div style={{ ...styles.loadingSpinner, ...styles.loadingSpinnerRed }}></div>
                                <span>Eliminando...</span>
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}