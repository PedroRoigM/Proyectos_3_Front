// Pagina para validar el correo
'use client';
import { useEffect, useState } from "react";
import PatchValidation from "../components/lib/validate";
import TopBar from "../components/TopBar";
export default function Page() {
    // codigo de 6 digitos
    const [code, setCode] = useState('');

    const handleChange = (e) => {
        setCode(e.target.value);
    }
    const handleSubmit = () => {
        PatchValidation(code);
    }
    return (
        <div>
            <h1>Validar correo</h1>
            <p>Introduce el código de 6 dígitos que te hemos enviado al correo</p>

            <input type="text" value={code} onChange={handleChange} />
            <button onClick={handleSubmit}>Validar</button>
        </div>
    )

}