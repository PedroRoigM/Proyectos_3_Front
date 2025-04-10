'use client';
import GetTFG from "../../../components/lib/GetTFG";
import GetTFGpdf from "../../../components/lib/GetTFGpdf";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { styles } from '../../components/styles/components';


export default function Page() {
    const id = useSearchParams().get('id');
    const [tfg, setTfg] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 3; // Número de palabras clave visibles por defecto

    useEffect(() => {
        const getTFG = async () => {
            const tfg = await GetTFG(id);
            console.log(tfg);
            setTfg(tfg);
        };
        const getTFGpdf = async () => {
            const pdf = await GetTFGpdf(id);
            setTfg(prevTfg => ({ ...prevTfg, pdf }));
        }
        getTFG();
        getTFGpdf();

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
    }, [id]);

    const downloadPDF = async () => {
        // Crear un Uint8Array a partir del ArrayBuffer del PDF
        const uint8Array = new Uint8Array(tfg.pdf);

        // Crear un Blob usando el array de bytes
        const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });

        // Crear la URL del objeto
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Crear el elemento para la descarga
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = `${tfg.tfgTitle}.pdf`; // Nombre del archivo PDF

        // Añadir al documento, hacer clic y eliminar
        document.body.appendChild(a);
        a.click();

        // Pequeño retraso antes de limpiar para asegurar que la descarga comience
        setTimeout(() => {
            URL.revokeObjectURL(pdfUrl); // Liberar el objeto URL
            a.remove(); // Eliminar el elemento <a> después de la descarga
        }, 100);
    }

    // Manejar el evento contextmenu para prevenir clic derecho
    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    if (!tfg) return <div>Loading...</div>;

    return (
        <div className={styles.specific_tfg.id.container}>
            <div className={styles.specific_tfg.id.title}>
                <div>
                    <h2>{tfg.tfgTitle}</h2>
                    <h3>{tfg.degree.degree}</h3>
                </div>
                <div className={styles.specific_tfg.id.button.container}>
                    <Link
                        href={`/dashboard/admin/tfg/edit/${tfg._id}?id=${tfg._id}`}
                        className={styles.specific_tfg.id.button.edit}>
                        <p>Editar</p>
                    </Link>
                    <button className={styles.specific_tfg.id.button.download}>
                        <p onClick={downloadPDF}>Descargar</p>
                    </button>
                </div>
            </div>
            <div className={styles.specific_tfg.id.info.container}>
                {/* Contenedor de palabras clave */}
                <div className={styles.specific_tfg.id.info.keywords.container}>
                    {tfg.keywords.slice(0, showAll ? tfg.keywords.length : maxVisible).map((element, index) => (
                        <p key={index} className={styles.specific_tfg.id.info.keywords.keyword}>
                            {element}
                        </p>
                    ))}
                    {tfg.keywords.length > maxVisible && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className={styles.specific_tfg.id.info.keywords.extend}
                        >
                            {showAll ? "Ver menos" : "Ver más"}
                        </button>
                    )}
                </div>

                {/* Información de Año y Tutor */}
                <div className={styles.specific_tfg.id.info.tutoryear}>
                    <p><strong>Año:</strong> {tfg.year.year}</p>
                    <p><strong>Tutor:</strong> {tfg.advisor.advisor}</p>
                </div>
            </div>
            <div className={styles.specific_tfg.id.resumen}>
                <h2>Resumen</h2>
                <p>{tfg.abstract}</p>
            </div>

            {/* PDF */}
            {tfg.pdf && (
                <div className={styles.specific_tfg.id.pdf.margin}>
                    <h2 className={styles.specific_tfg.id.pdf.title}>Documento TFG</h2>

                    {/* Contenedor del PDF con posición relativa */}
                    <div className={styles.specific_tfg.id.pdf.image.container} onContextMenu={handleContextMenu}>
                        {/* Marca de agua */}
                        <div className={styles.specific_tfg.id.pdf.image.watermark}>
                            <div className={styles.specific_tfg.id.pdf.image.warning}>
                                SOLO VISUALIZACIÓN
                            </div>
                        </div>

                        {/* Contenedor para object con desplazamiento negativo */}
                        <div className={styles.specific_tfg.id.pdf.notvisualizable.object}>
                            <object
                                data={`data:application/pdf;base64,${Buffer.from(tfg.pdf).toString('base64')}`}
                                type="application/pdf"
                                className={styles.specific_tfg.id.pdf.notvisualizable.object}
                            >
                                <p className={styles.specific_tfg.id.pdf.notvisualizable.text}>Tu navegador no puede mostrar PDFs.</p>
                            </object>
                        </div>

                        {/* Capa superior para bloquear selectivamente interacciones */}
                        <div className={styles.specific_tfg.id.pdf.blocker}></div>
                    </div>

                    <div className={styles.specific_tfg.id.pdf.text}>
                        Este documento está protegido. Visualización solo con fines académicos.
                    </div>
                </div>
            )}
        </div>
    );
}