// Componente que renderiza una tarjeta con la información de un TFG sin verificar
import React, { useState } from 'react';
import Link from 'next/link';
import DeleteTFG from '../../components/lib/DeleteTFG';
import PatchValidateTFG from '../../components/lib/PatchValidateTFG';
import { useNotification } from '../../../components/errors/notification-context';
import { useApiError } from '../../../components/errors/api-error-hook';

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

    return (
        <div className="border border-gray-400 rounded-lg overflow-hidden shadow-md mb-4 bg-white">
            <Link href={`/dashboard/admin/tfg/${tfg._id}?id=${tfg._id}`}>
                <div className="cursor-pointer bg-gray-100 p-4 hover:bg-gray-200 transition">
                    <h2 className="text-lg font-semibold">{truncateText(tfg.tfgTitle, 80)}</h2>
                    <h3 className="text-sm text-gray-700">{tfg.degree.degree}</h3>
                    <p className="text-sm text-gray-600">{truncateText(tfg.abstract, 200)}</p>
                </div>
            </Link>

            <div className="flex flex-wrap justify-between items-center bg-gray-200 p-3">
                {/* Palabras clave */}
                <div className="flex flex-wrap gap-1">
                    {tfg.keywords.map((element, index) => (
                        <span key={index} className="border border-gray-500 text-xs px-2 py-1 rounded-md">
                            {element}
                        </span>
                    ))}
                </div>

                {/* Botones */}
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                        className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        onClick={() => validateTFG(tfg._id)}
                        disabled={loading}
                    >
                        {actionType === 'verify' && loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                <span>Verificando...</span>
                            </>
                        ) : (
                            'Verificar'
                        )}
                    </button>
                    <button
                        className="bg-white border border-red-500 text-red-500 text-sm font-semibold px-4 py-1 rounded-md hover:bg-red-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        onClick={() => deleteTFG(tfg._id)}
                        disabled={loading}
                    >
                        {actionType === 'delete' && loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
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