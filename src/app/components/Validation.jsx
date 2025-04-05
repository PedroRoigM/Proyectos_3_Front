'use client';
import { useState } from "react";
export default function Validation({ sendCode }) {
    // codigo de 6 digitos
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        setCode(e.target.value);
        setErrors('');
    }
    const handleSubmit = async () => {
        if (!code) {
            setErrors({ code: 'El código es obligatorio' });
            return;
        }
        const response = await sendCode(code);
        console.log(response);
        setErrors(response);

    }
    return (
        <div className="flex items-center justify-center">
            <div className="bg-white mt-[10%] p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-gray-800 font-bold text-2xl mb-4">Validar correo</h1>
                <p className="text-gray-700 mb-4">Introduce el código de 6 dígitos que te hemos enviado al correo</p>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <input
                        type="text"
                        value={code}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none mb-4"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded-md"
                    >
                        Validar
                    </button>
                </form>
                {errors.account && <p className="text-red-500 text-sm mt-2">{errors.account}</p>}
            </div>
        </div>
    )
}