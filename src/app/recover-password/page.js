// Página para enviar el correo y, al recibir la respuesta, tiene que pedir el codigo de 6 digitos y la nueva contraseña

'use client';
import { useEffect, useState } from "react";
import PostRecoverPassword from "../components/lib/PostRecoverPassword";
import PatchRecoverPassword from "../components/lib/PatchRecoverPassword";
import TopBar from "../components/TopBar";

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
    });
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: '',
        });
    }

    const handleSubmit = async () => {
        let newErrors = {};
        if (step === 1) {
            if (!formData.email) {
                newErrors.email = 'El email es obligatorio';
            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            const response = await PostRecoverPassword(formData.email);
            if (response === null) {
                setErrors({ email: 'El email no existe' });
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.code) {
                newErrors.code = 'El código es obligatorio';
            }
            if (!formData.password) {
                newErrors.password = 'La contraseña es obligatoria';
            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            const response = await PatchRecoverPassword(formData);
            if (response === null) {
                setErrors({ code: 'El código es incorrecto' });
                return;
            }
            setStep(3);
        }
    }

    const handleRollback = () => {
        if (step === 1) {
            window.location.href = '/';
            return;
        }
        if (step === 2) {
            setFormData({
                email: '',
                code: '',
                password: '',
            });
        }
        setStep(step - 1);
    }

    return (
        <div className="font-montserrat rounded-md from-white to-gray-400 bg-gradient-to-b h-screen">
            <div className="flex items-center justify-center mt-[8%]">
                <div className="flex flex-col bg-white p-10 rounded-lg shadow-lg w-4/5 md:w-2/5 lg:w-1/3 text-center">
                    <h1 className="text-gray-800 font-bold text-2xl mb-[20%]">Recuperar contraseña</h1>

                    {step === 1 && (
                        <div>
                            <p className="mb-[5%]">Introduce tu correo electrónico</p>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`border-2 ${errors.email ? 'border-red-500' : 'border-black'} mb-[20%] p-2 rounded-md w-full`} />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>
                    )}
                    {step === 2 && (
                        <div className="mb-[20%]">
                            <div className="mb-[5%]">
                                <p>Introduce el código</p>
                                <input type="text" name="code" value={formData.code} onChange={handleChange} className={`border-2 ${errors.code ? 'border-red-500' : 'border-black'} p-2 rounded-md w-full`} />
                                {errors.code && <p className="text-red-500">{errors.code}</p>}
                            </div>
                            <div>
                                <p>Introduce tu nueva contraseña</p>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} className={`border-2 ${errors.password ? 'border-red-500' : 'border-black'} p-2 rounded-md w-full`} />
                                {errors.password && <p className="text-red-500">{errors.password}</p>}
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <p>Contraseña cambiada correctamente</p>
                    )}
                    <div className="flex justify-between mt-4">
                        <button type="submit" onClick={handleSubmit} className='bg-[#0065ef] px-8 text-white border-2 font-bold py-2 rounded-md hover:bg-[#14192c] transition'>
                            Enviar
                        </button>
                        <button onClick={handleRollback} className='bg-[#ffffff] text-black border-2 border-[#14192c] font-bold px-4 py-2 rounded-md hover:bg-[#9da3a7] transition'>
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}