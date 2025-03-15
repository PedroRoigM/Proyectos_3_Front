'use client';
import GetTFG from "../../components/lib/GetTFG";
import GetTFGpdf from "../../components/lib/GetTFGpdf";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function Page() {
    const id = useSearchParams().get('id');
    const [tfg, setTfg] = useState(null);
    useEffect(() => {
        const getTFG = async () => {
            const tfg = await GetTFG({ id: id });
            setTfg(tfg);
        };
        const getTFGpdf = async () => {
            const pdf = await GetTFGpdf({ id: id });
            setTfg(prevTfg => ({ ...prevTfg, pdf }));
        }
        getTFG();
        getTFGpdf();
    }, [id]);
    if (!tfg) return <div>Loading...</div>;
    return (
        <div>
            <h1>{tfg.tfgTitle}</h1>
            <p><strong>Abstract:</strong> {tfg.abstract}</p>
            <p><strong>Year:</strong> {tfg.year}</p>
            <p><strong>Degree:</strong> {tfg.degree}</p>
            <p><strong>Student:</strong> {tfg.student}</p>
            <p><strong>Advisor:</strong> {tfg.advisor}</p>
            <p><strong>Keywords:</strong> {tfg.keywords.join(', ')}</p>
            {tfg.pdf && (
                <div>
                    <h1>PDF</h1>
                    <object
                        data={`data:application/pdf;base64,${Buffer.from(tfg.pdf).toString('base64')}`}
                        type="application/pdf"
                        width="100%" height="600">
                        <p>PDF cannot be displayed.</p>
                    </object>
                </div>
            )}
        </div>
    );
}