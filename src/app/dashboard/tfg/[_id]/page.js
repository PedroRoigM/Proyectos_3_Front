'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ErrorBoundary } from '../../../components/errors/error-boundary';
import { useNotification } from '../../../components/errors/notification-context';
import { useApiError } from '../../../components/errors/api-error-hook';
import GetTFG from '../../components/lib/GetTFG';
import GetTFGpdf from '../../components/lib/GetTFGpdf';
import TFGDetailCommon from '../../../components/TFGDetailCommon';

function TFGDetailsContent() {
    const id = useSearchParams().get('id');
    const [tfg, setTfg] = useState(null);
    const { showError } = useNotification();
    const { loading, executeRequest } = useApiError();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener datos del TFG
                const tfgData = await executeRequest(
                    async () => await GetTFG(id),
                    {
                        errorMessage: 'No se pudieron cargar los detalles del TFG'
                    }
                );

                if (tfgData) {
                    setTfg(tfgData);

                    // Obtener PDF después de tener los datos básicos
                    try {
                        const pdfData = await executeRequest(
                            async () => await GetTFGpdf(id),
                            {
                                errorMessage: 'No se pudo cargar el archivo PDF',
                                showLoadingState: false
                            }
                        );

                        if (pdfData) {
                            setTfg(prevTfg => ({ ...prevTfg, pdf: pdfData }));
                        }
                    } catch (pdfError) {
                        console.error("Error al cargar el PDF:", pdfError);
                        showError('No se pudo cargar el archivo PDF del TFG');
                    }
                } else {
                    showError('No se pudieron cargar los detalles del TFG');
                }
            } catch (error) {
                console.error("Error al cargar los detalles del TFG:", error);
                showError('Ha ocurrido un error al cargar los detalles del TFG');
            }
        };

        fetchData();

        // Añadir protección contra atajos de teclado para descargar
        const handleKeyDown = (e) => {
            if ((e.ctrlKey && e.key === 's') ||
                (e.ctrlKey && e.key === 'p') ||
                (e.ctrlKey && e.shiftKey && e.key === 's')) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [id, showError, executeRequest]);

    // Para usuarios normales no hay acciones adicionales
    const renderActions = () => null;

    return (
        <TFGDetailCommon
            tfg={tfg}
            isLoading={loading}
            error={!tfg && !loading}
            renderActions={renderActions}
        />
    );
}

export default function TFGDetails() {
    return (
        <ErrorBoundary>
            <TFGDetailsContent />
        </ErrorBoundary>
    );
}