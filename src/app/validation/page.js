// Pagina para validar el correo
'use client';
import { useEffect, useState } from "react";
import PatchValidation from "../components/lib/validate";
import TopBar from "../components/TopBar";
export default function Page() {
    // codigo de 6 digitos
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCode(e.target.value);
        setError(''); // Clear error message when user starts typing
    }
    const handleSubmit = async () => {
        try {
            const result = await PatchValidation(code);
            if (result === null) {
                setError('Código incorrecto');
            } else {
                console.log(result);
            }
        } catch (error) {
            setError('Código incorrecto');
            console.error('Error validating user:', error);
        }
    }
    return (
        <div style={{...styles.container, backgroundColor: error ? 'red' : '#f0f0f0'}}>
            <div style={styles.box}>
                <h1>Validar correo</h1>
                <p>Introduce el código de 6 dígitos que te hemos enviado al correo</p>

                <input type="text" value={code} onChange={handleChange} style={styles.input} />
                <button onClick={handleSubmit} style={styles.button}>Validar</button>
                {error && <p style={styles.error}>{error}</p>}
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
    box: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '400px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    }
};