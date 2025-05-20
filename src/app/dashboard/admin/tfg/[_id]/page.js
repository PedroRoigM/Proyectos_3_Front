'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ErrorBoundary } from '../../../../components/errors/error-boundary';
import { useNotification } from '../../../../components/errors/notification-context';
import { useApiError } from '../../../../components/errors/api-error-hook';
import GetTFG from '../../../components/lib/GetTFG';
import GetTFGpdf from '../../../components/lib/GetTFGpdf';
import TFGDetailCommon from '../../../components/TFGDetailCommon';
import { tfgDetailsCommonStyles } from '../../../components/styles/tfg-details-common';

function AdminTFGDetailsContent() {
    const id = useSearchParams().get('id');
    const [tfg, setTfg] = useState(null);
    const { showError, showSuccess } = useNotification();
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

    // Función para descargar el PDF
    const downloadPDF = () => {
        if (tfg?.pdf) {
            try {
                const uint8Array = new Uint8Array(tfg.pdf);
                const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = `${tfg.tfgTitle}.pdf`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    URL.revokeObjectURL(pdfUrl);
                    a.remove();
                }, 100);
                showSuccess('Documento descargado correctamente');
            } catch (error) {
                console.error('Error al descargar el PDF:', error);
                showError('No se pudo descargar el documento');
            }
        }
    };

    // Renderizar acciones para administradores/coordinadores
    const renderActions = (tfg) => (
        <>
            <Link
                href={`/dashboard/admin/tfg/edit/${tfg._id}?id=${tfg._id}`}
                className={tfgDetailsCommonStyles.header.primaryButton}
            >
                Editar
            </Link>
            <button
                onClick={downloadPDF}
                className={tfgDetailsCommonStyles.header.secondaryButton}
            >
                Descargar
            </button>
        </>
    );


    return (
        <TFGDetailCommon
            tfg={tfg}
            isLoading={loading}
            error={!tfg && !loading}
            renderActions={renderActions}
        />
    );
}

export default function AdminTFGDetails() {
    return (
        <ErrorBoundary>
            <AdminTFGDetailsContent />
        </ErrorBoundary>
    );
}