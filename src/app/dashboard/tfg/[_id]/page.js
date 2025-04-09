'use client';
import GetTFG from "../../components/lib/GetTFG";
import GetTFGpdf from "../../components/lib/GetTFGpdf";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { tfgDetailsStyles } from "../../components/styles/tfg-details";

export default function Page() {
    const id = useSearchParams().get('id');
    const [tfg, setTfg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 3; // Número de palabras clave visibles por defecto

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tfgData = await GetTFG(id);
                setTfg(tfgData);

                try {
                    const pdfData = await GetTFGpdf(id);
                    setTfg(prevTfg => ({ ...prevTfg, pdf: pdfData }));
                } catch (error) {
                    console.error("Error al cargar el PDF:", error);
                }
            } catch (error) {
                console.error("Error al cargar los detalles del TFG:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Manejar el evento contextmenu para prevenir clic derecho
    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    if (loading) {
        return <LoadingSpinner message="Cargando detalles del proyecto..." />;
    }

    return (
        <div className={tfgDetailsStyles.layout.container}>
            <div className={tfgDetailsStyles.header.container}>
                <h2 className={tfgDetailsStyles.header.title}>{tfg.tfgTitle}</h2>
                <h3 className={tfgDetailsStyles.header.degree}>{tfg.degree}</h3>
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
                    <p><strong className={tfgDetailsStyles.metadata.infoLabel}>Año:</strong> {tfg.year}</p>
                    <p><strong className={tfgDetailsStyles.metadata.infoLabel}>Tutor:</strong> {tfg.advisor}</p>
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