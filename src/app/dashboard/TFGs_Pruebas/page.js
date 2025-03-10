'use client'
import Link from "next/link";
import PostTFG from "../components/lib/PostTFG";
import GetTFGs from "../components/lib/GetTFGs";
import GetTenTFGs from "../components/lib/GetTenTFGs";

import { useState } from "react";

export default function Page() {
    const [pageNum, setPageNum] = useState('');
    const [formData, setFormData] = useState({
        year: "22/23",
        degree: "Grado en Diseño de Productos Interactivos (DIPI)",
        student: "Paquito",
        tfgTitle: "ANÁLISIS DE BUENAS PRÁCTICAS EN EL DISEÑO DE INTERFACES PARA JUEGOS DE REALIDAD VIRTUAL",
        keywords: ["Realidad Virtual", "Experiencia de Usuario", "Interfaz de Usuario", "Inmersión"],
        advisor: "Álvaro Ortuño Morente",
        abstract: "prueba"
    });

    // Estados para los resultados y visibilidad
    const [getTFGsResult, setGetTFGsResult] = useState(null);
    const [postTFGResult, setPostTFGResult] = useState(null);
    const [getTenTFGsResult, setGetTenTFGsResult] = useState(null);

    const [showResults, setShowResults] = useState({
        getTFGs: false,
        getTFG: false,
        postTFG: false,
        getTenTFGs: false
    });

    // Funciones asincrónicas con actualización de estado
    const getTFGS = async () => {
        const tfgs = await GetTFGs();
        setGetTFGsResult(tfgs);
        setShowResults(prev => ({ ...prev, getTFGs: true }));
    };

    const postTFG = async () => {
        const tfg = await PostTFG({ formData: formData });
        setPostTFGResult(tfg);
        setShowResults(prev => ({ ...prev, postTFG: true }));
    };

    const getTenTFGs = async (pageNum, formData) => {
        const tfgs = await GetTenTFGs(pageNum, formData);
        setGetTenTFGsResult(tfgs);
        setShowResults(prev => ({ ...prev, getTenTFGs: true }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const toggleResults = (key) => {
        setShowResults(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#333', textAlign: 'center' }}>TFGs Pruebas Page</h1>

            {/* Get TFGs */}
            <button onClick={getTFGS} style={buttonStyle}>Get TFGs</button>
            <button onClick={() => toggleResults("getTFGs")} style={toggleButtonStyle}>
                {showResults.getTFGs ? "Ocultar Resultados" : "Mostrar Resultados"}
            </button>
            {showResults.getTFGs && getTFGsResult && getTFGsResult.map(tfg => (
                <Link key={tfg._id} href={`/dashboard/TFGs_Pruebas/${tfg._id}?id=${tfg._id}`} style={linkStyle}>
                    <pre style={resultStyle}>{JSON.stringify(tfg, null, 2)}</pre>
                </Link>
            ))}

            {/* Post TFG */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Post TFG</h2>
                <form onSubmit={(e) => { e.preventDefault(); postTFG(); }}>
                    {Object.keys(formData).map((key) => (
                        <div key={key} style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>{key}</label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                        </div>
                    ))}
                    <button type="submit" style={buttonStyle}>Post TFG</button>
                </form>
                <button onClick={() => toggleResults("postTFG")} style={toggleButtonStyle}>
                    {showResults.postTFG ? "Ocultar Resultados" : "Mostrar Resultados"}
                </button>
                {showResults.postTFG && postTFGResult && (
                    <Link href={`/dashboard/TFGs_Pruebas/${postTFGResult._id}?id=${postTFGResult._id}`} style={linkStyle}>
                        <pre style={resultStyle}>{JSON.stringify(postTFGResult, null, 2)}</pre>
                    </Link>
                )}
            </div>

            {/* Search TFGs */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Search TFGs</h2>
                <form onSubmit={(e) => { e.preventDefault(); getTenTFGs(pageNum, formData); }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Page Number</label>
                        <input
                            type="text"
                            value={pageNum}
                            onChange={(e) => setPageNum(e.target.value)}
                            placeholder="Enter Page Number"
                            style={inputStyle}
                        />
                    </div>
                    {Object.keys(formData).map((key) => (
                        <div key={key} style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>{key}</label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                        </div>
                    ))}
                    <button type="submit" style={buttonStyle}>Search TFGs</button>
                </form>
                <button onClick={() => toggleResults("getTenTFGs")} style={toggleButtonStyle}>
                    {showResults.getTenTFGs ? "Ocultar Resultados" : "Mostrar Resultados"}
                </button>
                {showResults.getTenTFGs && getTenTFGsResult && getTenTFGsResult.map(tfg => (
                    <Link key={tfg._id} href={`/dashboard/TFGs_Pruebas/${tfg._id}?id=${tfg._id}`} style={linkStyle}>
                        <pre style={resultStyle}>{JSON.stringify(tfg, null, 2)}</pre>
                    </Link>
                ))}
            </div>
        </div>
    );
}

// **Estilos**
const linkStyle = { textDecoration: "none", color: "inherit" };

const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px'
};

const toggleButtonStyle = {
    backgroundColor: '#FFA500',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px'
};
const inputStyle = {
    padding: '10px',
    width: 'calc(100% - 22px)',
    borderRadius: '5px',
    border: '1px solid #ccc',
    color: 'black',
    marginBottom: '10px'
};
const resultStyle = { backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', color: 'black' };
