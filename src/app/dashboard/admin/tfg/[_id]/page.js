'use client';
import GetTFG from "../../../components/lib/GetTFG";
import GetTFGpdf from "../../../components/lib/GetTFGpdf";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";


export default function Page() {
    const id = useSearchParams().get('id');
    const [tfg, setTfg] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const maxVisible = 3; // Número de palabras clave visibles por defecto

    useEffect(() => {
        const getTFG = async () => {
            const tfg = await GetTFG(id);
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
        <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%]">
            <div className="flex items-center justify-between p-5 pr-3 pl-3 rounded-md max-w-full overflow-hidden text-black">
                <div>
                    <h2>{tfg.tfgTitle}</h2>
                    <h3>{tfg.degree.degree}</h3>
                </div>
                <div className="flex gap-10">
                    <Link
                        href={`/dashboard/admin/tfg/edit/${tfg._id}?id=${tfg._id}`}
                        className='bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#14192c] transition'>
                        <p>Editar</p>
                    </Link>
                    <button className='text-black border-gray-400 border-2 font-bold px-4 py-2 rounded-md hover:bg-[#9da3a7] transition'>
                        <p onClick={downloadPDF}>Descargar</p>
                    </button>
                </div>
            </div>
            <div className="bg-[#e5e9ec] flex flex-wrap items-center justify-between p-5 pr-3 pl-3 rounded-md max-w-full overflow-hidden">
                {/* Contenedor de palabras clave */}
                <div className="flex gap-2 flex-wrap">
                    {tfg.keywords.slice(0, showAll ? tfg.keywords.length : maxVisible).map((element, index) => (
                        <p key={index} className="border border-gray-500 rounded-md px-2 py-1">
                            {element}
                        </p>
                    ))}
                    {tfg.keywords.length > maxVisible && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-blue-500 underline ml-2"
                        >
                            {showAll ? "Ver menos" : "Ver más"}
                        </button>
                    )}
                </div>

                {/* Información de Año y Tutor */}
                <div className="flex ml-auto text-right gap-x-4">
                    <p><strong>Año:</strong> {tfg.year.year}</p>
                    <p><strong>Tutor:</strong> {tfg.advisor.advisor}</p>
                </div>
            </div>
            <div className="mt-2 mb-8 bg-[#BEBEBE] p-5 border border-[#000000]">
                <h2>Resumen</h2>
                <p>{tfg.abstract}</p>
            </div>

            {/* PDF */}
            {tfg.pdf && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-4">Documento TFG</h2>

                    {/* Contenedor del PDF con posición relativa */}
                    <div className="relative w-full h-[800px] overflow-hidden rounded bg-gray-100 shadow-lg" onContextMenu={handleContextMenu}>
                        {/* Marca de agua */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="transform rotate-45 text-gray-400 text-5xl font-bold opacity-10 whitespace-nowrap">
                                SOLO VISUALIZACIÓN
                            </div>
                        </div>

                        {/* Contenedor para object con desplazamiento negativo */}
                        <div className="w-full h-full overflow-hidden">
                            <object
                                data={`data:application/pdf;base64,${Buffer.from(tfg.pdf).toString('base64')}`}
                                type="application/pdf"
                                className="w-full h-[calc(100%+40px)] -mt-10 border-0"
                            >
                                <p className="p-4 text-center">Tu navegador no puede mostrar PDFs.</p>
                            </object>
                        </div>

                        {/* Capa superior para bloquear selectivamente interacciones */}
                        <div className="absolute top-0 left-0 right-0 h-10 bg-white opacity-0 z-20"></div>
                    </div>

                    <div className="bg-gray-100 p-3 rounded text-center text-sm text-gray-600 mt-2">
                        Este documento está protegido. Visualización solo con fines académicos.
                    </div>
                </div>
            )}
        </div>
    );
}