'use client';
import GetTFG from "../../../components/lib/GetTFG";
import GetTFGpdf from "../../../components/lib/GetTFGpdf";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
            const pdf = await GetTFGpdf({ id: id });
            setTfg(prevTfg => ({ ...prevTfg, pdf }));
        }
        getTFG();
        getTFGpdf();
    }, [id]);
    const downdoadPDF = async () => {
        alert("Descargando PDF");
    }
    if (!tfg) return <div>Loading...</div>;
    return (
        <div className="font-montserrat w-full h-full flex flex-col justify-center mx-auto my-[50px] rounded-md max-w-[90%]">
            <div>
                <h2 >{tfg.tfgTitle}</h2>
                <h3>{tfg.degree}</h3>
            </div>
            <div>
                <button>
                    <a href={`/dashboard/tfg/admin/edit/${id}`}>Editar</a>
                </button>
                <button>
                    <p onClick={downdoadPDF}>Descargar</p>
                </button>
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
                    <p><strong>Año:</strong> {tfg.year}</p>
                    <p><strong>Tutor:</strong> {tfg.advisor}</p>
                </div>
            </div>
            <div className="mt-2 mb-8 bg-[#BEBEBE] p-5 border border-[#000000]">
                <h2>Resumen</h2>
                <p>{tfg.abstract}</p>
            </div>
            {
                tfg.pdf && (
                    <div>
                        <object
                            data={`data:application/pdf;base64,${Buffer.from(tfg.pdf).toString('base64')}`}
                            type="application/pdf"
                            width="100%" height="600">
                            <p>PDF cannot be displayed.</p>
                        </object>
                    </div>
                )
            }
        </div >
    )
}