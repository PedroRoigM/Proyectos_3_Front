'use client'
import Link from "next/link";
import PostTFG from "../components/lib/PostTFG";
import GetTFGs from "../components/lib/GetTFGs";
import PostTenTFGs from "../components/lib/PostTenTFGs";
import GetDegrees from "../components/lib/GetDegrees";
import GetYears from "../components/lib/GetYears";
import GetAdvisors from "../components/lib/GetAdvisors";
import { useEffect, useState } from "react";

export default function Page() {
    const [pageNum, setPageNum] = useState(1);
    const [tfgId, setTfgId] = useState("");
    const [pdfPages, setPdfPages] = useState([]);
    const [formData, setFormData] = useState({
        year: "",
        degree: "",
        student: "",
        tfgTitle: "",
        keywords: [],
        advisor: "",
        abstract: ""
    });
    const [formDataSearch, setFormDataSearch] = useState({
        year: "",
        degree: "",
        advisor: "",
        search: ""
    });
    const [degrees, setDegrees] = useState([{}]);
    const [years, setYears] = useState([{}]);
    const [advisors, setAdvisors] = useState([{}]);
    // Conseguir los grados y años
    useEffect(() => {
        GetDegrees().then(degrees => setDegrees([null, ...degrees]));
        GetYears().then(years => setYears([null, ...years]));
        GetAdvisors().then(advisors => setAdvisors([null, ...advisors]));
    }, []);

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
        try {
            console.log("Intentando postTFG...");

            // Verificar si formData está bien definido
            if (!formData || typeof formData !== "object") {
                console.error("Error: formData no está definido correctamente", formData);
                return;
            }
            const formattedKeywords = typeof formData.keywords === "string"
                ? formData.keywords.split(',').map(keyword => keyword.trim())
                : Array.isArray(formData.keywords)
                    ? formData.keywords.map(keyword => keyword.trim())
                    : [];

            console.log("Enviando TFG con:", { ...formData, keywords: formattedKeywords });

            // Eliminar el campo pageNumber si existe
            const { pageNumber, ...filteredFormData } = formData;
            const tfg = await PostTFG({
                ...filteredFormData,
                keywords: formattedKeywords
            });

            console.log("TFG guardado:", tfg);

            setPostTFGResult(tfg);
            setShowResults(prev => ({ ...prev, postTFG: true }));
        } catch (error) {
            console.error("Error al publicar TFG:", error);
        }
    };

    const getTenTFGs = async () => {
        const sanitizedFormDataSearch = Object.fromEntries(
            Object.entries(formDataSearch).filter(([key, value]) => value !== "")
        );
        const tfgs = await PostTenTFGs(pageNum, sanitizedFormDataSearch);
        console.log(tfgs);
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
    const handleInputChangeSearch = (e) => {
        const { name, value } = e.target;
        setFormDataSearch({
            ...formDataSearch,
            [name]: value
        });
    };
    const toggleResults = (key) => {
        setShowResults(prev => ({ ...prev, [key]: !prev[key] }));
    };


    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: 'white', textAlign: 'center' }}>TFGs Pruebas Page</h1>

            {/* Get TFGs */}
            <button onClick={getTFGS} style={buttonStyle}>Get TFGs</button>
            <button onClick={() => toggleResults("getTFGs")} style={toggleButtonStyle}>
                {showResults.getTFGs ? "Ocultar Resultados" : "Mostrar Resultados"}
            </button>
            {showResults.getTFGs && getTFGsResult && getTFGsResult.map((tfg, index) => (
                <Link key={tfg?._id || `tfg-${index}`} href={`/dashboard/TFGs_Pruebas/${tfg._id}?id=${tfg._id}`} style={linkStyle}>
                    <pre style={resultStyle}>{JSON.stringify(tfg, null, 2)}</pre>
                </Link>
            ))}

            {/* Post TFG */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Post TFG</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Formulario enviado");
                    postTFG();
                }}>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Year</label>
                        <select name="year" value={formData.year} onChange={handleInputChange} style={inputStyle}>
                            {years.map((year, index) => (
                                <option key={year?.year || `year-${index}`} value={year?.year || ""}>
                                    {year ? year.year : "Año"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Degree</label>
                        <select name="degree" value={formData.degree} onChange={handleInputChange} style={inputStyle}>
                            {degrees.map((degree, index) => (
                                <option key={degree?._id || `degree-${index}`} value={degree?.degree || ""}>
                                    {degree ? degree.degree : "Grado"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Advisor</label>
                        <select name="advisor" value={formData.advisor} onChange={handleInputChange} style={inputStyle}>
                            {advisors.map((advisor, index) => (
                                <option key={advisor?._id || `degree-${index}`} value={advisor?.advisor || ""}>
                                    {advisor ? advisor.advisor : "Tutor"}
                                </option>
                            ))}
                        </select>
                    </div>
                    {Object.keys(formData).filter(key => key !== 'year' && key !== 'degree' && key != 'advisor').map((key) => (
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
                <form onSubmit={(e) => { e.preventDefault(); getTenTFGs(); }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Page Number</label>
                        <input
                            type="text"
                            value={pageNum}
                            onChange={(e) => setPageNum(Number(e.target.value))}
                            placeholder="Enter Page Number"
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Year</label>
                        <select name="year" value={formDataSearch.year} onChange={handleInputChangeSearch} style={inputStyle}>
                            {years.map((year, index) => (
                                <option key={year?.year || `year-${index}`} value={year?.year || ""}>
                                    {year ? year.year : "Año"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Degree</label>
                        <select name="degree" value={formDataSearch.degree} onChange={handleInputChangeSearch} style={inputStyle}>
                            {degrees.map((degree, index) => (
                                <option key={degree?._id || `degree-${index}`} value={degree?.degree || ""}>
                                    {degree ? degree.degree : "Grado"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Advisor</label>
                        <select name="advisor" value={formDataSearch.advisor} onChange={handleInputChangeSearch} style={inputStyle}>
                            {advisors.map((advisor, index) => (
                                <option key={advisor?._id || `degree-${index}`} value={advisor?.advisor || ""}>
                                    {advisor ? advisor.advisor : "Tutor"}
                                </option>
                            ))}
                        </select>
                    </div>
                    {Object.keys(formDataSearch).filter(key => key !== 'year' && key !== 'degree' && key != 'advisor').map((key) => (
                        <div key={key} style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>{key}</label>
                            <input
                                type="text"
                                name={key}
                                value={formDataSearch[key]}
                                onChange={handleInputChangeSearch}
                                style={inputStyle}
                            />
                        </div>
                    ))}
                    <button type="submit" style={buttonStyle}>Search TFGs</button>
                </form>
                <button onClick={() => toggleResults("getTenTFGs")} style={toggleButtonStyle}>
                    {showResults.getTenTFGs ? "Ocultar Resultados" : "Mostrar Resultados"}
                </button>
                {showResults.getTenTFGs && getTenTFGsResult && getTenTFGsResult.map((tfg, index) => (
                    <Link key={tfg?._id || `tenTFG-${index}`} href={`/dashboard/TFGs_Pruebas/${tfg._id}?id=${tfg._id}`} style={linkStyle}>
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
