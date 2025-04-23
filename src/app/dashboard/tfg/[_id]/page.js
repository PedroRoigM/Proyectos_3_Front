'use client';
import GetTFG from "../../components/lib/GetTFG";
import GetTFGpdf from "../../components/lib/GetTFGpdf";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { tfgDetailsStyles } from "../../components/styles/tfg-datails";
import { ErrorBoundary } from '../../../components/errors/error-boundary';
import { useNotification } from '../../../components/errors/notification-context';
import { useApiError } from '../../../components/errors/api-error-hook';

function TFGDetailsContent() {
    const id = useSearchParams().get('id');
    const [tfg, setTfg] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 3; // Número de palabras clave visibles por defecto
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

    // Manejar el evento contextmenu para prevenir clic derecho
    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    if (loading) {
        return <LoadingSpinner message="Cargando detalles del proyecto..." />;
    }

    if (!tfg) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 text-lg">No se encontró el TFG solicitado.</p>
            </div>
        );
    }

    return (
        <div className={tfgDetailsStyles.layout.container}>
            <div className={tfgDetailsStyles.header.container}>
                <h2 className={tfgDetailsStyles.header.title}>{tfg.tfgTitle}</h2>
                <h3 className={tfgDetailsStyles.header.degree}>{tfg.degree.degree}</h3>
            </div>

            <div className={tfgDetailsStyles.metadata.container}>
                {/* Contenedor de palabras clave */}
                <div className={tfgDetailsStyles.metadata.keywordsContainer}>
                    {tfg.keywords.slice(0, showAll ? tfg.keywords.length : maxVisible).map((element, index) => (
                        <p key={index} className={tfgDetailsStyles.metadata.keyword}>
                            {element}
                        </p>
                    ))}
                    {tfg.keywords.length > maxVisible && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className={tfgDetailsStyles.metadata.keywordToggle}
                        >
                            {showAll ? "Ver menos" : "Ver más"}
                        </button>
                    )}
                </div>

                {/* Información de Año y Tutor */}
                <div className={tfgDetailsStyles.metadata.infoContainer}>
                    <p><strong className={tfgDetailsStyles.metadata.infoLabel}>Año:</strong> {tfg.year.year}</p>
                    <p><strong className={tfgDetailsStyles.metadata.infoLabel}>Tutor:</strong> {tfg.advisor.advisor}</p>
                </div>
            </div>

            <div className={tfgDetailsStyles.abstract.container}>
                <h2 className={tfgDetailsStyles.abstract.title}>Resumen</h2>
                <p className={tfgDetailsStyles.abstract.text}>{tfg.abstract}</p>
            </div>

            {/* PDF */}
            {tfg.pdf && (
                <div className={tfgDetailsStyles.pdf.container}>
                    <h2 className={tfgDetailsStyles.pdf.title}>Documento TFG</h2>

                    {/* Contenedor del PDF con posición relativa */}
                    <div className={tfgDetailsStyles.pdf.viewerContainer} onContextMenu={handleContextMenu}>
                        {/* Marca de agua */}
                        <div className={tfgDetailsStyles.pdf.watermark}>
                            <div className={tfgDetailsStyles.pdf.watermarkText}>
                                SOLO VISUALIZACIÓN
                            </div>
                        </div>

                        {/* Contenedor para object con desplazamiento negativo */}
                        <div className={tfgDetailsStyles.pdf.objectContainer}>
                            <object
                                data={`data:application/pdf;base64,${Buffer.from(tfg.pdf).toString('base64')}`}
                                type="application/pdf"
                                className={tfgDetailsStyles.pdf.pdfObject}
                            >
                                <p className={tfgDetailsStyles.pdf.fallbackMessage}>
                                    Tu navegador no puede mostrar PDFs.
                                </p>
                            </object>
                        </div>

                        {/* Capa superior para bloquear selectivamente interacciones */}
                        <div className={tfgDetailsStyles.pdf.protectionOverlay}></div>
                    </div>

                    <div className={tfgDetailsStyles.pdf.disclaimer}>
                        Este documento está protegido. Visualización solo con fines académicos.
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TFGDetails() {
    return (
        <ErrorBoundary>
            <TFGDetailsContent />
        </ErrorBoundary>
    );
}