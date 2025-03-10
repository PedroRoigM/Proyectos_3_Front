'use client'
import GetTFG from "../../components/lib/GetTFG";
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
        getTFG();
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
            <p><strong>Link:</strong> <a href={tfg.link} target="_blank" rel="noopener noreferrer">{tfg.link}</a></p>
        </div>
    );
}