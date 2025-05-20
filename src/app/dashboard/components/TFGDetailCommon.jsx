'use client';

import { useState, useEffect } from 'react';
import { tfgDetailsCommonStyles } from './styles/tfg-details-common';
import Image from 'next/image';

export default function TFGDetailCommon({
    tfg,
    isLoading,
    error,
    renderActions, // Función que renderiza las acciones (botones) específicas según el rol
    loadingMessage = "Cargando detalles del proyecto...",
    errorMessage = "No se encontró el TFG solicitado."
}) {
    const [showAllKeywords, setShowAllKeywords] = useState(false);
    const maxVisibleKeywords = 3; // Número de palabras clave visibles por defecto

    // Manejar el evento contextmenu para prevenir clic derecho en el PDF
    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    // Si está cargando, mostrar el spinner
    if (isLoading) {
        return (
            <div className={tfgDetailsCommonStyles.states.loadingContainer}>
                <div className={tfgDetailsCommonStyles.states.loadingSpinner}></div>
                <p className={tfgDetailsCommonStyles.states.loadingText}>{loadingMessage}</p>
            </div>
        );
    }

    // Si hay un error o no hay TFG, mostrar mensaje de error
    if (error || !tfg) {
        return (
            <div className={tfgDetailsCommonStyles.states.errorContainer}>
                <p className={tfgDetailsCommonStyles.states.errorText}>{errorMessage}</p>
            </div>
        );
    }

    // Determinar las palabras clave a mostrar según el estado
    const displayedKeywords = showAllKeywords
        ? tfg.keywords
        : tfg.keywords.slice(0, maxVisibleKeywords);

    const hasMoreKeywords = tfg.keywords.length > maxVisibleKeywords;

    return (
        <div className={tfgDetailsCommonStyles.layout.container}>
            {/* Primera tarjeta: Título y metadatos */}
            <div className={tfgDetailsCommonStyles.layout.contentWrapper}>
                <div className={tfgDetailsCommonStyles.layout.innerContainer}>
                    {/* Encabezado con título y acciones */}
                    <div className={tfgDetailsCommonStyles.header.container}>
                        <h1 className={tfgDetailsCommonStyles.header.title}>{tfg.tfgTitle}</h1>

                        {/* Renderizar acciones específicas según el rol */}
                        {renderActions && (
                            <div className={tfgDetailsCommonStyles.header.actionsContainer}>
                                {renderActions(tfg)}
                            </div>
                        )}
                    </div>

                    {/* Fila de tags y metadata */}
                    <div className={tfgDetailsCommonStyles.metadata.tagsRow}>
                        {displayedKeywords.map((keyword, index) => (
                            <span key={index} className={tfgDetailsCommonStyles.metadata.tag}>
                                {keyword}
                            </span>
                        ))}
                    </div>

                    <div className={tfgDetailsCommonStyles.metadata.infoRow}>
                        <div className={tfgDetailsCommonStyles.metadata.infoItem}>
                            <span className={tfgDetailsCommonStyles.metadata.infoLabel}>Año: </span>
                            <span className={tfgDetailsCommonStyles.metadata.infoValue}>{tfg.year?.year || tfg.year}</span>
                        </div>

                        <div className={tfgDetailsCommonStyles.metadata.infoItem}>
                            <span className={tfgDetailsCommonStyles.metadata.infoLabel}>Tutor: </span>
                            <span className={tfgDetailsCommonStyles.metadata.infoValue}>{tfg.advisor?.advisor || tfg.advisor}</span>
                        </div>
                    </div>

                    {/* Abstracto con líneas de placeholder */}
                    <div className={tfgDetailsCommonStyles.abstract.container}>
                        <h2 className={tfgDetailsCommonStyles.abstract.title}>Abstracto</h2>
                        {/* Líneas de placeholder como en la imagen */}
                        <div className={tfgDetailsCommonStyles.abstract.content}>
                            {tfg.abstract ? (
                                <p>{tfg.abstract}</p>
                            ) : (
                                <>
                                    <div className={tfgDetailsCommonStyles.abstract.placeholder}></div>
                                    <div className={tfgDetailsCommonStyles.abstract.placeholder} style={{ width: '80%' }}></div>
                                    <div className={tfgDetailsCommonStyles.abstract.placeholder}></div>
                                    <div className={tfgDetailsCommonStyles.abstract.placeholder} style={{ width: '90%' }}></div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF */}
            {tfg.pdf && (
                <div className={tfgDetailsCommonStyles.pdf.container}>
                    <h2 className={tfgDetailsCommonStyles.pdf.title}>Documento TFG</h2>

                    {/* Contenedor del PDF con posición relativa */}
                    <div className={tfgDetailsCommonStyles.pdf.viewerContainer} onContextMenu={handleContextMenu}>
                        {/* Marca de agua */}
                        <div className={tfgDetailsCommonStyles.pdf.watermark}>
                            <div className={tfgDetailsCommonStyles.pdf.watermarkText}>
                                SOLO VISUALIZACIÓN
                            </div>
                        </div>

                        {/* Contenedor para object con desplazamiento negativo */}
                        <div className={tfgDetailsCommonStyles.pdf.objectContainer}>
                            <object
                                data={`data:application/pdf;base64,${Buffer.from(tfg.pdf).toString('base64')}`}
                                type="application/pdf"
                                className={tfgDetailsCommonStyles.pdf.pdfObject}
                            >
                                <p className={tfgDetailsCommonStyles.pdf.fallbackMessage}>
                                    Tu navegador no puede mostrar PDFs.
                                </p>
                            </object>
                        </div>

                        {/* Capa superior para bloquear selectivamente interacciones */}
                        <div className={tfgDetailsCommonStyles.pdf.protectionOverlay}></div>
                    </div>

                    <div className={tfgDetailsCommonStyles.pdf.disclaimer}>
                        Este documento está protegido. Visualización solo con fines académicos.
                    </div>
                </div>
            )}
        </div>

    );
}