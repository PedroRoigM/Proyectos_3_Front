// Página para enviar el correo y, al recibir la respuesta, tiene que pedir el codigo de 6 digitos y la nueva contraseña

'use client';
import { useEffect, useState } from "react";
import PostRecoverPassword from "../components/lib/PostRecoverPassword";
import PatchRecoverPassword from "../components/lib/PatchRecoverPassword";

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
    });
    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const handleSubmit = async () => {
        if (step === 1) {
            await PostRecoverPassword(formData.email);
            setStep(2);
        } else if (step === 2) {
            await PatchRecoverPassword(formData);
            setStep(3);
        }
    }

    return (
        <div>
            <h1>Recuperar contraseña</h1>
            {step === 1 && (
                <div>
                    <p>Introduce tu correo electrónico</p>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
            )}
            {step === 2 && (
                <div>
                    <p>Introduce el código de 6 dígitos que te hemos enviado al correo</p>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} />
                    <p>Introduce tu nueva contraseña</p>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
            )}
            {step === 3 && (
                <p>Contraseña cambiada correctamente</p>
            )}
            <button onClick={handleSubmit}>Enviar</button>
        </div>
    )
}